import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.enums import ProductStatus, ReservationStatus
from app.models.product import Product
from app.models.reservation import Reservation
from app.models.reservation_item import ReservationItem


class NotFoundError(Exception):
    pass


class InsufficientStockError(Exception):
    pass


class ReservationNotCancellableError(Exception):
    pass


def create_reservation(
    db: Session, user_id: uuid.UUID, product_id: int, quantity: int
) -> Reservation:
    # Row lock on the product prevents two concurrent reservations from both
    # reading the same remain_quantity and over-selling the last item.
    product = db.execute(
        select(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
        .with_for_update()
    ).scalar_one_or_none()

    if product is None:
        raise NotFoundError()
    if product.status != ProductStatus.ON_SALE or product.remain_quantity < quantity:
        raise InsufficientStockError()

    product.remain_quantity -= quantity
    if product.remain_quantity == 0:
        product.status = ProductStatus.SOLD_OUT

    reservation = Reservation(
        reservation_number="PENDING",
        user_id=user_id,
        total_price=product.discount_price * quantity,
        status=ReservationStatus.RESERVED,
        pickup_time=product.pickup_start,
    )
    db.add(reservation)
    db.flush()

    reservation.reservation_number = f"M{datetime.now(timezone.utc).year}{reservation.id:04d}"
    db.add(
        ReservationItem(
            reservation_id=reservation.id,
            product_id=product.id,
            quantity=quantity,
            price=product.discount_price,
        )
    )
    db.flush()

    return get_reservation(db, reservation.id, user_id)


def _reservation_query(user_id: uuid.UUID):
    return (
        select(Reservation)
        .where(Reservation.user_id == user_id)
        .options(selectinload(Reservation.items).selectinload(ReservationItem.product))
    )


def list_reservations(db: Session, user_id: uuid.UUID) -> list[Reservation]:
    stmt = _reservation_query(user_id).order_by(Reservation.id.desc())
    return list(db.execute(stmt).scalars().unique().all())


def get_reservation(db: Session, reservation_id: int, user_id: uuid.UUID) -> Reservation | None:
    stmt = _reservation_query(user_id).where(Reservation.id == reservation_id)
    return db.execute(stmt).scalars().unique().one_or_none()


def cancel_reservation(db: Session, reservation_id: int, user_id: uuid.UUID) -> Reservation:
    reservation = db.execute(
        select(Reservation)
        .where(Reservation.id == reservation_id, Reservation.user_id == user_id)
        .with_for_update()
    ).scalar_one_or_none()

    if reservation is None:
        raise NotFoundError()
    if reservation.status != ReservationStatus.RESERVED:
        raise ReservationNotCancellableError()

    items = db.execute(
        select(ReservationItem).where(ReservationItem.reservation_id == reservation.id)
    ).scalars().all()

    for item in items:
        product = db.get(Product, item.product_id)
        product.remain_quantity += item.quantity
        if product.status == ProductStatus.SOLD_OUT:
            product.status = ProductStatus.ON_SALE

    reservation.status = ReservationStatus.CANCELLED
    db.flush()

    return get_reservation(db, reservation.id, user_id)
