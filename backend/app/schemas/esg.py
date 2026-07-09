from pydantic import BaseModel


class EsgSummary(BaseModel):
    saved_food_kg: float
    saved_co2: float
    saved_money: int
