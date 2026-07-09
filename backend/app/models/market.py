from datetime import time as time_

from sqlalchemy import Numeric, String, Time
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import CreatedAtMixin, SoftDeleteMixin


class Market(Base, CreatedAtMixin, SoftDeleteMixin):
    __tablename__ = "markets"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=False)
    longitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    thumbnail: Mapped[str | None] = mapped_column(String(500), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    open_time: Mapped[time_ | None] = mapped_column(Time, nullable=True)
    close_time: Mapped[time_ | None] = mapped_column(Time, nullable=True)
