import uuid

from sqlalchemy import Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import StoreCategory
from app.models.mixins import CreatedAtMixin, SoftDeleteMixin


class Store(Base, CreatedAtMixin, SoftDeleteMixin):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    market_id: Mapped[int] = mapped_column(ForeignKey("markets.id"), nullable=False)
    # Docs/04 §57 defines owner_name as free text only. Added so a MERCHANT-role
    # user can be resolved to the store they manage (needed for Merchant
    # Dashboard / Product Upload access control in later tasks).
    owner_user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[StoreCategory] = mapped_column(
        Enum(StoreCategory, name="store_category"), nullable=False
    )
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    owner_name: Mapped[str | None] = mapped_column(String(50), nullable=True)
    thumbnail: Mapped[str | None] = mapped_column(String(500), nullable=True)
