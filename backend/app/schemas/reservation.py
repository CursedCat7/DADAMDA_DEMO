from datetime import datetime

from pydantic import BaseModel, Field

from app.models.enums import ReservationStatus


class ReservationCreateRequest(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class ReservationItemDetail(BaseModel):
    product_id: int
    title: str
    quantity: int
    price: int
    original_price: int

    model_config = {"from_attributes": True}


class ReservationDetail(BaseModel):
    id: int
    reservation_number: str
    status: ReservationStatus
    total_price: int
    pickup_time: datetime
    created_at: datetime
    items: list[ReservationItemDetail]

    model_config = {"from_attributes": True}
