from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.reservation import Reservation


class ReservationItem(Base):
    __tablename__ = "reservation_items"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    reservation_id: Mapped[int] = mapped_column(ForeignKey("reservations.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[int] = mapped_column(Numeric(10, 0), nullable=False)

    reservation: Mapped["Reservation"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
