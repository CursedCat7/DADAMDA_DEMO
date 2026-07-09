from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import market as market_crud
from app.db.session import get_db
from app.schemas.market import MarketDetail, MarketListItem
from app.schemas.response import SuccessResponse
from app.schemas.store import StoreListItem

router = APIRouter(prefix="/api/v1/markets", tags=["market"])


@router.get("", response_model=SuccessResponse[list[MarketListItem]])
def get_markets(db: Session = Depends(get_db)) -> SuccessResponse[list[MarketListItem]]:
    rows = market_crud.list_markets(db)
    data = [
        MarketListItem(
            id=market.id,
            name=market.name,
            address=market.address,
            thumbnail=market.thumbnail,
            discount_count=discount_count,
            avg_discount_percent=round(float(avg_discount_percent), 1),
        )
        for market, discount_count, avg_discount_percent in rows
    ]
    return SuccessResponse(data=data)


@router.get("/{market_id}", response_model=SuccessResponse[MarketDetail])
def get_market(market_id: int, db: Session = Depends(get_db)) -> SuccessResponse[MarketDetail]:
    row = market_crud.get_market_with_stats(db, market_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Market not found")

    market, discount_count, avg_discount_percent, store_count = row
    data = MarketDetail(
        id=market.id,
        name=market.name,
        address=market.address,
        latitude=float(market.latitude),
        longitude=float(market.longitude),
        description=market.description,
        thumbnail=market.thumbnail,
        phone=market.phone,
        open_time=market.open_time,
        close_time=market.close_time,
        discount_count=discount_count,
        avg_discount_percent=round(float(avg_discount_percent), 1),
        store_count=store_count,
    )
    return SuccessResponse(data=data)


@router.get("/{market_id}/stores", response_model=SuccessResponse[list[StoreListItem]])
def get_market_stores(
    market_id: int, db: Session = Depends(get_db)
) -> SuccessResponse[list[StoreListItem]]:
    if not market_crud.market_exists(db, market_id):
        raise HTTPException(status_code=404, detail="Market not found")

    stores = market_crud.list_stores_by_market(db, market_id)
    data = [StoreListItem.model_validate(store, from_attributes=True) for store in stores]
    return SuccessResponse(data=data)
