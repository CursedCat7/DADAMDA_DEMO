import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_merchant_id
from app.crud import merchant as merchant_crud
from app.db.session import get_db
from app.models.reservation import Reservation
from app.schemas.merchant import MerchantReservationDetail, MerchantReservationItem
from app.schemas.response import SuccessResponse

router = APIRouter(prefix="/api/v1/merchant", tags=["merchant"])


def _to_detail(reservation: Reservation) -> MerchantReservationDetail:
    return MerchantReservationDetail(
        id=reservation.id,
        reservation_number=reservation.reservation_number,
        status=reservation.status,
        total_price=reservation.total_price,
        pickup_time=reservation.pickup_time,
        created_at=reservation.created_at,
        customer_nickname=reservation.user.nickname,
        items=[
            MerchantReservationItem(
                product_id=item.product_id,
                title=item.product.title,
                quantity=item.quantity,
                price=item.price,
            )
            for item in reservation.items
        ],
    )


@router.get("/reservations", response_model=SuccessResponse[list[MerchantReservationDetail]])
def get_merchant_reservations(
    merchant_id: uuid.UUID = Depends(get_current_merchant_id),
    db: Session = Depends(get_db),
) -> SuccessResponse[list[MerchantReservationDetail]]:
    reservations = merchant_crud.list_merchant_reservations(db, merchant_id)
    return SuccessResponse(data=[_to_detail(r) for r in reservations])


@router.put(
    "/reservations/{reservation_id}/pickup",
    response_model=SuccessResponse[MerchantReservationDetail],
)
def complete_pickup(
    reservation_id: int,
    merchant_id: uuid.UUID = Depends(get_current_merchant_id),
    db: Session = Depends(get_db),
) -> SuccessResponse[MerchantReservationDetail]:
    try:
        reservation = merchant_crud.complete_pickup(db, merchant_id, reservation_id)
    except merchant_crud.NotFoundError as exc:
        raise HTTPException(status_code=404, detail="Reservation not found") from exc
    except merchant_crud.NotPickupableError as exc:
        raise HTTPException(
            status_code=400, detail="Only reserved reservations can be picked up"
        ) from exc

    return SuccessResponse(data=_to_detail(reservation), message="수령 처리되었습니다.")
