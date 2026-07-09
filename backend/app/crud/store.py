from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.enums import ProductStatus
from app.models.product import Product
from app.models.store import Store


def get_store_with_stats(db: Session, store_id: int) -> tuple[Store, int] | None:
    stmt = (
        select(Store, func.count(Product.id).filter(Product.status == ProductStatus.ON_SALE))
        .outerjoin(Product, Product.store_id == Store.id)
        .where(Store.id == store_id, Store.deleted_at.is_(None))
        .group_by(Store.id)
    )
    row = db.execute(stmt).first()
    return tuple(row) if row is not None else None


def store_exists(db: Session, store_id: int) -> bool:
    stmt = select(Store.id).where(Store.id == store_id, Store.deleted_at.is_(None))
    return db.execute(stmt).first() is not None


def list_products_by_store(db: Session, store_id: int) -> list[Product]:
    stmt = (
        select(Product)
        .where(Product.store_id == store_id, Product.deleted_at.is_(None))
        .order_by(Product.id)
    )
    return list(db.execute(stmt).scalars().all())
