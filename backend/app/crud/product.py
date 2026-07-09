from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.product import Product


def list_products(db: Session) -> list[Product]:
    stmt = select(Product).where(Product.deleted_at.is_(None)).order_by(Product.id)
    return list(db.execute(stmt).scalars().all())


def get_product(db: Session, product_id: int) -> Product | None:
    stmt = select(Product).where(Product.id == product_id, Product.deleted_at.is_(None))
    return db.execute(stmt).scalar_one_or_none()
