from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import store as store_crud
from app.db.session import get_db
from app.schemas.product import ProductListItem
from app.schemas.response import SuccessResponse
from app.schemas.store import StoreDetail

router = APIRouter(prefix="/api/v1/stores", tags=["store"])


@router.get("/{store_id}", response_model=SuccessResponse[StoreDetail])
def get_store(store_id: int, db: Session = Depends(get_db)) -> SuccessResponse[StoreDetail]:
    row = store_crud.get_store_with_stats(db, store_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Store not found")

    store, discount_count = row
    data = StoreDetail(
        id=store.id,
        market_id=store.market_id,
        name=store.name,
        category=store.category,
        description=store.description,
        thumbnail=store.thumbnail,
        phone=store.phone,
        owner_name=store.owner_name,
        discount_count=discount_count,
    )
    return SuccessResponse(data=data)


@router.get("/{store_id}/products", response_model=SuccessResponse[list[ProductListItem]])
def get_store_products(
    store_id: int, db: Session = Depends(get_db)
) -> SuccessResponse[list[ProductListItem]]:
    if not store_crud.store_exists(db, store_id):
        raise HTTPException(status_code=404, detail="Store not found")

    products = store_crud.list_products_by_store(db, store_id)
    data = [ProductListItem.model_validate(product) for product in products]
    return SuccessResponse(data=data)
