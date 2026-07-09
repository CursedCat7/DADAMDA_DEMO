from datetime import datetime, timedelta, timezone

from app.models.enums import ProductStatus, StoreCategory
from app.models.market import Market
from app.models.product import Product
from app.models.store import Store


def _seed_store_with_products(db_session):
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

    return store, on_sale, sold_out


def test_get_store_detail_includes_discount_count(client, db_session) -> None:
    store, *_ = _seed_store_with_products(db_session)

    response = client.get(f"/api/v1/stores/{store.id}")

    assert response.status_code == 200
    body = response.json()["data"]
    assert body["name"] == "영희반찬"
    assert body["category"] == "반찬"
    assert body["discount_count"] == 1

    missing = client.get("/api/v1/stores/999999")
    assert missing.status_code == 404
    assert missing.json()["success"] is False


def test_get_store_products_lists_all_products_regardless_of_status(client, db_session) -> None:
    store, on_sale, sold_out = _seed_store_with_products(db_session)

    response = client.get(f"/api/v1/stores/{store.id}/products")

    assert response.status_code == 200
    body = response.json()["data"]
    ids = {item["id"] for item in body}
    assert ids == {on_sale.id, sold_out.id}
    on_sale_item = next(item for item in body if item["id"] == on_sale.id)
    assert on_sale_item["discount_price"] == 5600
    assert on_sale_item["status"] == "판매중"

    missing = client.get("/api/v1/stores/999999/products")
    assert missing.status_code == 404
