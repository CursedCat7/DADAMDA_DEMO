from datetime import datetime, timedelta, timezone

from app.models.enums import ProductStatus, StoreCategory
from app.models.market import Market
from app.models.product import Product
from app.models.store import Store


def _seed_product(db_session):
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

    product = Product(
        store_id=store.id,
        title="제육볶음",
        description="매콤한 제육볶음",
        original_price=8000,
        discount_price=5600,
        discount_percent=30,
        remain_quantity=3,
        pickup_start=now,
        pickup_end=now + timedelta(hours=1),
        status=ProductStatus.ON_SALE,
    )
    db_session.add(product)
    db_session.flush()

    return product


def test_get_products_returns_all_products(client, db_session) -> None:
    product = _seed_product(db_session)

    response = client.get("/api/v1/products")

    assert response.status_code == 200
    body = response.json()["data"]
    assert any(item["id"] == product.id and item["title"] == "제육볶음" for item in body)


def test_get_product_detail_includes_store_id_and_description(client, db_session) -> None:
    product = _seed_product(db_session)

    response = client.get(f"/api/v1/products/{product.id}")

    assert response.status_code == 200
    body = response.json()["data"]
    assert body["store_id"] == product.store_id
    assert body["description"] == "매콤한 제육볶음"
    assert body["discount_percent"] == 30

    missing = client.get("/api/v1/products/999999")
    assert missing.status_code == 404
    assert missing.json()["success"] is False
