from sqlalchemy import ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import CreatedAtMixin


class ESGStat(Base, CreatedAtMixin):
    __tablename__ = "esg_stats"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    market_id: Mapped[int] = mapped_column(ForeignKey("markets.id"), nullable=False)
    saved_food_kg: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    saved_co2: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0)
    saved_money: Mapped[int] = mapped_column(Numeric(12, 0), nullable=False, default=0)
