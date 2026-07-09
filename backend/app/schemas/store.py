from pydantic import BaseModel

from app.models.enums import StoreCategory


class StoreListItem(BaseModel):
    id: int
    name: str
    category: StoreCategory
    description: str | None
    thumbnail: str | None
    phone: str | None
    owner_name: str | None
