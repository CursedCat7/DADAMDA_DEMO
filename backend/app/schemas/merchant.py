from datetime import datetime

from pydantic import BaseModel

from app.models.enums import ReservationStatus


class MerchantReservationItem(BaseModel):
    product_id: int
    title: str
    quantity: int
    price: int


class MerchantReservationDetail(BaseModel):
    id: int
    reservation_number: str
    status: ReservationStatus
    total_price: int
    pickup_time: datetime
    created_at: datetime
    customer_nickname: str
    items: list[MerchantReservationItem]
