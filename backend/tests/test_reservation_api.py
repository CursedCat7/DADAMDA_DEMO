import uuid
from datetime import datetime, timedelta, timezone

from app.models.enums import ProductStatus, StoreCategory, UserRole
from app.models.market import Market
from app.models.product import Product
from app.models.store import Store
from app.models.user import User


def _seed(db_session, remain_quantity=3):
    now = datetime.now(timezone.utc)

    user = User(nickname="김민수", email=f"{uuid.uuid4()}@example.com", role=UserRole.USER)
    other_user = User(
        nickname="다른사람", email=f"{uuid.uuid4()}@example.com", role=UserRole.USER
    )
    db_session.add_all([user, other_user])
    db_session.flush()

    market = Market(name="모래내시장", address="인천 서구", latitude=37.5, longitude=126.6)
    db_session.add(market)
    db_session.flush()

    store = Store(market_id=market.id, name="영희반찬", category=StoreCategory.BANCHAN)
    db_session.add(store)
    db_session.flush()

    product = Product(
        store_id=store.id,
        title="제육볶음",
        original_price=8000,
        discount_price=5600,
        discount_percent=30,
        remain_quantity=remain_quantity,
        pickup_start=now + timedelta(minutes=10),
        pickup_end=now + timedelta(hours=1),
        status=ProductStatus.ON_SALE,
    )
    db_session.add(product)
    db_session.flush()

    return user, other_user, product


def test_create_reservation_decrements_stock(client, db_session) -> None:
    user, _other, product = _seed(db_session, remain_quantity=3)

    response = client.post(
        "/api/v1/reservations",
        json={"product_id": product.id, "quantity": 1},
        headers={"X-User-Id": str(user.id)},
    )

    assert response.status_code == 201
    body = response.json()["data"]
    assert body["reservation_number"].startswith("M")
    assert body["total_price"] == 5600
    assert body["items"][0]["title"] == "제육볶음"

    db_session.refresh(product)
    assert product.remain_quantity == 2
    assert product.status == ProductStatus.ON_SALE


def test_create_reservation_sells_out_last_item(client, db_session) -> None:
    user, _other, product = _seed(db_session, remain_quantity=1)

    response = client.post(
        "/api/v1/reservations",
        json={"product_id": product.id, "quantity": 1},
        headers={"X-User-Id": str(user.id)},
    )

    assert response.status_code == 201
    db_session.refresh(product)
    assert product.remain_quantity == 0
    assert product.status == ProductStatus.SOLD_OUT


def test_create_reservation_rejects_insufficient_stock(client, db_session) -> None:
    user, _other, product = _seed(db_session, remain_quantity=1)

    response = client.post(
        "/api/v1/reservations",
        json={"product_id": product.id, "quantity": 5},
        headers={"X-User-Id": str(user.id)},
    )

    assert response.status_code == 400
    assert response.json()["success"] is False


def test_create_reservation_requires_user_header(client, db_session) -> None:
    _user, _other, product = _seed(db_session)

    response = client.post(
        "/api/v1/reservations", json={"product_id": product.id, "quantity": 1}
    )

    assert response.status_code == 401


def test_create_reservation_rejects_unknown_user(client, db_session) -> None:
    _user, _other, product = _seed(db_session)

    response = client.post(
        "/api/v1/reservations",
        json={"product_id": product.id, "quantity": 1},
        headers={"X-User-Id": str(uuid.uuid4())},
    )

    assert response.status_code == 401


def test_reservation_list_and_get_are_scoped_to_owner(client, db_session) -> None:
    user, other_user, product = _seed(db_session, remain_quantity=5)

    create_response = client.post(
        "/api/v1/reservations",
        json={"product_id": product.id, "quantity": 1},
        headers={"X-User-Id": str(user.id)},
    )
    reservation_id = create_response.json()["data"]["id"]

    own_list = client.get("/api/v1/reservations", headers={"X-User-Id": str(user.id)})
    assert len(own_list.json()["data"]) == 1

    other_list = client.get(
        "/api/v1/reservations", headers={"X-User-Id": str(other_user.id)}
    )
    assert other_list.json()["data"] == []

    other_get = client.get(
        f"/api/v1/reservations/{reservation_id}", headers={"X-User-Id": str(other_user.id)}
    )
    assert other_get.status_code == 404


def test_cancel_reservation_restores_stock(client, db_session) -> None:
    user, _other, product = _seed(db_session, remain_quantity=1)

    create_response = client.post(
        "/api/v1/reservations",
        json={"product_id": product.id, "quantity": 1},
        headers={"X-User-Id": str(user.id)},
    )
    reservation_id = create_response.json()["data"]["id"]

    db_session.refresh(product)
    assert product.status == ProductStatus.SOLD_OUT

    cancel_response = client.delete(
        f"/api/v1/reservations/{reservation_id}", headers={"X-User-Id": str(user.id)}
    )

    assert cancel_response.status_code == 200
    assert cancel_response.json()["data"]["status"] == "취소"

    db_session.refresh(product)
    assert product.remain_quantity == 1
    assert product.status == ProductStatus.ON_SALE

    second_cancel = client.delete(
        f"/api/v1/reservations/{reservation_id}", headers={"X-User-Id": str(user.id)}
    )
    assert second_cancel.status_code == 400
