from datetime import datetime, timedelta, timezone

from app.models.enums import ProductStatus, StoreCategory
from app.models.market import Market
from app.models.product import Product
from app.models.store import Store


def _seed_market_with_products(db_session):
    now = datetime.now(timezone.utc)

    market = Market(
        name="모래내시장",
        address="인천 서구 모래내로",
        latitude=37.505,
        longitude=126.677,
    )
    db_session.add(market)
    db_session.flush()

    store = Store(market_id=market.id, name="영희반찬", category=StoreCategory.BANCHAN)
    db_session.add(store)
    db_session.flush()

    on_sale = Product(
        store_id=store.id,
        title="제육볶음",
        original_price=8000,
        discount_price=5600,
        discount_percent=30,
        remain_quantity=3,
        pickup_start=now,
        pickup_end=now + timedelta(hours=1),
        status=ProductStatus.ON_SALE,
    )
    sold_out = Product(
        store_id=store.id,
        title="잡채",
        original_price=10000,
        discount_price=6000,
        discount_percent=40,
        remain_quantity=0,
        pickup_start=now,
        pickup_end=now + timedelta(hours=1),
        status=ProductStatus.SOLD_OUT,
    )
    db_session.add_all([on_sale, sold_out])
    db_session.flush()

    return market, store


def test_get_markets_returns_discount_stats(client, db_session) -> None:
    market, _store = _seed_market_with_products(db_session)

    response = client.get("/api/v1/markets")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    item = next(m for m in body["data"] if m["id"] == market.id)
    assert item["name"] == "모래내시장"
    assert item["discount_count"] == 1
    assert item["avg_discount_percent"] == 30.0


def test_get_market_detail_includes_store_count(client, db_session) -> None:
    market, _store = _seed_market_with_products(db_session)

    response = client.get(f"/api/v1/markets/{market.id}")

    assert response.status_code == 200
    body = response.json()["data"]
    assert body["store_count"] == 1
    assert body["discount_count"] == 1

    missing = client.get("/api/v1/markets/999999")
    assert missing.status_code == 404
    assert missing.json()["success"] is False


def test_get_market_stores_lists_stores_in_market(client, db_session) -> None:
    market, store = _seed_market_with_products(db_session)

    response = client.get(f"/api/v1/markets/{market.id}/stores")

    assert response.status_code == 200
    body = response.json()["data"]
    assert len(body) == 1
    assert body[0]["id"] == store.id
    assert body[0]["category"] == "반찬"

    missing = client.get("/api/v1/markets/999999/stores")
    assert missing.status_code == 404
