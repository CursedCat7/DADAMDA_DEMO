from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import product as product_crud
from app.db.session import get_db
from app.schemas.product import ProductDetail, ProductListItem
from app.schemas.response import SuccessResponse

router = APIRouter(prefix="/api/v1/products", tags=["product"])


@router.get("", response_model=SuccessResponse[list[ProductListItem]])
def get_products(db: Session = Depends(get_db)) -> SuccessResponse[list[ProductListItem]]:
    products = product_crud.list_products(db)
    data = [ProductListItem.model_validate(product) for product in products]
    return SuccessResponse(data=data)


@router.get("/{product_id}", response_model=SuccessResponse[ProductDetail])
def get_product(
    product_id: int, db: Session = Depends(get_db)
) -> SuccessResponse[ProductDetail]:
    product = product_crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    data = ProductDetail.model_validate(product)
    return SuccessResponse(data=data)
