from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.enums import ProductStatus
from app.models.mixins import SoftDeleteMixin, TimestampMixin


class Product(Base, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    original_price: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    discount_price: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)
    discount_percent: Mapped[int] = mapped_column(Integer, nullable=False)
    remain_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    pickup_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    pickup_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[ProductStatus] = mapped_column(
        Enum(ProductStatus, name="product_status"),
        nullable=False,
        default=ProductStatus.ON_SALE,
    )
