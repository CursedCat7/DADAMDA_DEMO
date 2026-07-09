from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.esg_stat import ESGStat


def get_esg_summary(db: Session) -> tuple[float, float, int]:
    # Docs/04 §65/§67 treat ESGStat as its own generated series (nightly
    # scheduler / mock-data seeding), not something derived live from
    # reservations - saved_food_kg and saved_co2 need a weight/CO2-per-kg
    # assumption that isn't documented anywhere in the ERD. This sums
    # whatever rows exist; until the scheduler/mock-data task seeds real
    # rows, an empty table just means zeros rather than an error.
    row = db.execute(
        select(
            func.coalesce(func.sum(ESGStat.saved_food_kg), 0),
            func.coalesce(func.sum(ESGStat.saved_co2), 0),
            func.coalesce(func.sum(ESGStat.saved_money), 0),
        )
    ).one()
    saved_food_kg, saved_co2, saved_money = row
    return float(saved_food_kg), float(saved_co2), int(saved_money)
