from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.enums import ProductStatus
from app.models.market import Market
from app.models.product import Product
from app.models.store import Store


def _discount_count_col():
    return func.count(Product.id).filter(Product.status == ProductStatus.ON_SALE)


def _avg_discount_percent_col():
    return func.coalesce(
        func.avg(Product.discount_percent).filter(Product.status == ProductStatus.ON_SALE), 0
    )


def list_markets(db: Session) -> list[tuple[Market, int, float]]:
    stmt = (
        select(Market, _discount_count_col(), _avg_discount_percent_col())
        .outerjoin(Store, Store.market_id == Market.id)
        .outerjoin(Product, Product.store_id == Store.id)
        .where(Market.deleted_at.is_(None))
        .group_by(Market.id)
        .order_by(Market.id)
    )
    return list(db.execute(stmt).all())


def get_market_with_stats(db: Session, market_id: int) -> tuple[Market, int, float, int] | None:
    stmt = (
        select(
            Market,
            _discount_count_col(),
            _avg_discount_percent_col(),
            func.count(func.distinct(Store.id)),
        )
        .outerjoin(Store, Store.market_id == Market.id)
        .outerjoin(Product, Product.store_id == Store.id)
        .where(Market.id == market_id, Market.deleted_at.is_(None))
        .group_by(Market.id)
    )
    row = db.execute(stmt).first()
    return tuple(row) if row is not None else None


def market_exists(db: Session, market_id: int) -> bool:
    stmt = select(Market.id).where(Market.id == market_id, Market.deleted_at.is_(None))
    return db.execute(stmt).first() is not None


def list_stores_by_market(db: Session, market_id: int) -> list[Store]:
    stmt = (
        select(Store)
        .where(Store.market_id == market_id, Store.deleted_at.is_(None))
        .order_by(Store.id)
    )
    return list(db.execute(stmt).scalars().all())
