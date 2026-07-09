from app.models.esg_stat import ESGStat
from app.models.market import Market


def test_get_esg_returns_zeros_when_no_data(client) -> None:
    response = client.get("/api/v1/esg")

    assert response.status_code == 200
    body = response.json()["data"]
    assert body == {"saved_food_kg": 0.0, "saved_co2": 0.0, "saved_money": 0}


def test_get_esg_sums_across_markets(client, db_session) -> None:
    market = Market(name="모래내시장", address="인천 서구", latitude=37.5, longitude=126.6)
    db_session.add(market)
    db_session.flush()

    db_session.add_all(
        [
            ESGStat(market_id=market.id, saved_food_kg=10, saved_co2=2.5, saved_money=50000),
            ESGStat(market_id=market.id, saved_food_kg=8, saved_co2=1.8, saved_money=32000),
        ]
    )
    db_session.flush()

    response = client.get("/api/v1/esg")

    assert response.status_code == 200
    body = response.json()["data"]
    assert body["saved_food_kg"] == 18.0
    assert body["saved_co2"] == 4.3
    assert body["saved_money"] == 82000
