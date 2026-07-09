from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.esg import get_esg_summary
from app.db.session import get_db
from app.schemas.esg import EsgSummary
from app.schemas.response import SuccessResponse

router = APIRouter(prefix="/api/v1/esg", tags=["esg"])


@router.get("", response_model=SuccessResponse[EsgSummary])
def get_esg(db: Session = Depends(get_db)) -> SuccessResponse[EsgSummary]:
    saved_food_kg, saved_co2, saved_money = get_esg_summary(db)
    data = EsgSummary(
        saved_food_kg=saved_food_kg, saved_co2=saved_co2, saved_money=saved_money
    )
    return SuccessResponse(data=data)
