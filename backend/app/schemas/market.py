from datetime import time

from pydantic import BaseModel


class MarketListItem(BaseModel):
    id: int
    name: str
    address: str
    thumbnail: str | None
    discount_count: int
    avg_discount_percent: float


class MarketDetail(BaseModel):
    id: int
    name: str
    address: str
    latitude: float
    longitude: float
    description: str | None
    thumbnail: str | None
    phone: str | None
    open_time: time | None
    close_time: time | None
    discount_count: int
    avg_discount_percent: float
    store_count: int
