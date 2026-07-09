import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_id
from app.crud import reservation as reservation_crud
from app.db.session import get_db
from app.models.reservation import Reservation
from app.schemas.reservation import (
    ReservationCreateRequest,
    ReservationDetail,
    ReservationItemDetail,
)
from app.schemas.response import SuccessResponse

router = APIRouter(prefix="/api/v1/reservations", tags=["reservation"])


def _to_detail(reservation: Reservation) -> ReservationDetail:
    return ReservationDetail(
        id=reservation.id,
        reservation_number=reservation.reservation_number,
        status=reservation.status,
        total_price=reservation.total_price,
        pickup_time=reservation.pickup_time,
        created_at=reservation.created_at,
        items=[
            ReservationItemDetail(
                product_id=item.product_id,
                title=item.product.title,
                quantity=item.quantity,
                price=item.price,
            )
            for item in reservation.items
        ],
    )


@router.post(
    "",
    response_model=SuccessResponse[ReservationDetail],
    status_code=status.HTTP_201_CREATED,
)
def create_reservation(
    body: ReservationCreateRequest,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> SuccessResponse[ReservationDetail]:
    try:
        reservation = reservation_crud.create_reservation(
            db, user_id=user_id, product_id=body.product_id, quantity=body.quantity
        )
    except reservation_crud.NotFoundError as exc:
        raise HTTPException(status_code=404, detail="Product not found") from exc
    except reservation_crud.InsufficientStockError as exc:
        raise HTTPException(status_code=400, detail="Not enough stock remaining") from exc

    return SuccessResponse(data=_to_detail(reservation), message="예약이 완료되었습니다.")


@router.get("", response_model=SuccessResponse[list[ReservationDetail]])
def get_reservations(
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> SuccessResponse[list[ReservationDetail]]:
    reservations = reservation_crud.list_reservations(db, user_id)
    return SuccessResponse(data=[_to_detail(r) for r in reservations])


@router.get("/{reservation_id}", response_model=SuccessResponse[ReservationDetail])
def get_reservation(
    reservation_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> SuccessResponse[ReservationDetail]:
    reservation = reservation_crud.get_reservation(db, reservation_id, user_id)
    if reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return SuccessResponse(data=_to_detail(reservation))


@router.delete("/{reservation_id}", response_model=SuccessResponse[ReservationDetail])
def cancel_reservation(
    reservation_id: int,
    user_id: uuid.UUID = Depends(get_current_user_id),
    db: Session = Depends(get_db),
) -> SuccessResponse[ReservationDetail]:
    try:
        reservation = reservation_crud.cancel_reservation(db, reservation_id, user_id)
    except reservation_crud.NotFoundError as exc:
        raise HTTPException(status_code=404, detail="Reservation not found") from exc
    except reservation_crud.ReservationNotCancellableError as exc:
        raise HTTPException(
            status_code=400, detail="Only reserved reservations can be cancelled"
        ) from exc

    return SuccessResponse(data=_to_detail(reservation), message="예약이 취소되었습니다.")
