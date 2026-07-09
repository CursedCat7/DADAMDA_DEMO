import uuid

from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.enums import ReservationStatus
from app.models.product import Product
from app.models.reservation import Reservation
from app.models.reservation_item import ReservationItem
from app.models.store import Store


class NotFoundError(Exception):
    pass


class NotPickupableError(Exception):
    pass


def _merchant_reservation_query(merchant_id: uuid.UUID):
    # A store with no owner_user_id set is treated as visible to any
    # merchant. This MVP only ever has one merchant persona (§63 mock
    # login), and requiring every demo-seeded store to be explicitly
    # claimed first would make the merchant screen show nothing out of
    # the box. Stores that DO have an owner are scoped correctly.
    return (
        select(Reservation)
        .join(ReservationItem, ReservationItem.reservation_id == Reservation.id)
        .join(Product, Product.id == ReservationItem.product_id)
        .join(Store, Store.id == Product.store_id)
        .where(or_(Store.owner_user_id == merchant_id, Store.owner_user_id.is_(None)))
        .options(
            selectinload(Reservation.items).selectinload(ReservationItem.product),
            selectinload(Reservation.user),
        )
        .distinct()
    )


def list_merchant_reservations(db: Session, merchant_id: uuid.UUID) -> list[Reservation]:
    stmt = _merchant_reservation_query(merchant_id).order_by(Reservation.created_at.desc())
    return list(db.execute(stmt).scalars().unique().all())


def complete_pickup(db: Session, merchant_id: uuid.UUID, reservation_id: int) -> Reservation:
    stmt = _merchant_reservation_query(merchant_id).where(Reservation.id == reservation_id)
    reservation = db.execute(stmt).scalars().unique().one_or_none()

    if reservation is None:
        raise NotFoundError()
    if reservation.status != ReservationStatus.RESERVED:
        raise NotPickupableError()

    reservation.status = ReservationStatus.PICKED_UP
    db.flush()
    return reservation
