from datetime import datetime

from pydantic import BaseModel

from app.models.enums import ProductStatus


class ProductListItem(BaseModel):
    id: int
    title: str
    original_price: int
    discount_price: int
    discount_percent: int
    remain_quantity: int
    pickup_start: datetime
    pickup_end: datetime
    image_url: str | None
    status: ProductStatus

    model_config = {"from_attributes": True}
