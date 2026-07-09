import uuid
from datetime import datetime, timedelta, timezone

from app.models.enums import ProductStatus, ReservationStatus, StoreCategory, UserRole
from app.models.market import Market
from app.models.product import Product
from app.models.reservation import Reservation
from app.models.reservation_item import ReservationItem
from app.models.store import Store
from app.models.user import User


def _seed_reservation(db_session, owner_user_id=None):
    now = datetime.now(timezone.utc)

    merchant = User(nickname="박영희", email=f"{uuid.uuid4()}@example.com", role=UserRole.MERCHANT)
    consumer = User(nickname="김민수", email=f"{uuid.uuid4()}@example.com", role=UserRole.USER)
    db_session.add_all([merchant, consumer])
    db_session.flush()

    market = Market(name="모래내시장", address="인천 서구", latitude=37.5, longitude=126.6)
    db_session.add(market)
    db_session.flush()

    store = Store(
        market_id=market.id,
        name="영희반찬",
        category=StoreCategory.BANCHAN,
        owner_user_id=owner_user_id,
    )
    db_session.add(store)
    db_session.flush()

    product = Product(
        store_id=store.id,
        title="제육볶음",
        original_price=8000,
        discount_price=5600,
        discount_percent=30,
        remain_quantity=2,
        pickup_start=now,
        pickup_end=now + timedelta(hours=1),
        status=ProductStatus.ON_SALE,
    )
    db_session.add(product)
    db_session.flush()

    reservation = Reservation(
        reservation_number=f"M2026{uuid.uuid4().int % 10000:04d}",
        user_id=consumer.id,
        total_price=5600,
        status=ReservationStatus.RESERVED,
        pickup_time=now + timedelta(minutes=30),
    )
    db_session.add(reservation)
    db_session.flush()
    db_session.add(
        ReservationItem(
            reservation_id=reservation.id, product_id=product.id, quantity=1, price=5600
        )
    )
    db_session.flush()

    return merchant, reservation


def test_merchant_reservations_requires_merchant_role(client, db_session) -> None:
    consumer = User(nickname="김민수", email=f"{uuid.uuid4()}@example.com", role=UserRole.USER)
    db_session.add(consumer)
    db_session.flush()

    response = client.get(
        "/api/v1/merchant/reservations", headers={"X-User-Id": str(consumer.id)}
    )

    assert response.status_code == 403


def test_merchant_sees_reservation_for_unowned_store(client, db_session) -> None:
    merchant, reservation = _seed_reservation(db_session, owner_user_id=None)

    response = client.get(
        "/api/v1/merchant/reservations", headers={"X-User-Id": str(merchant.id)}
    )

    assert response.status_code == 200
    body = response.json()["data"]
    assert any(r["id"] == reservation.id for r in body)
    matched = next(r for r in body if r["id"] == reservation.id)
    assert matched["customer_nickname"] == "김민수"
    assert matched["items"][0]["title"] == "제육볶음"


def test_merchant_does_not_see_other_merchants_owned_store(client, db_session) -> None:
    other_merchant_id = uuid.uuid4()
    other_merchant = User(
        id=other_merchant_id,
        nickname="다른상인",
        email=f"{uuid.uuid4()}@example.com",
        role=UserRole.MERCHANT,
    )
    db_session.add(other_merchant)
    db_session.flush()

    merchant, reservation = _seed_reservation(db_session, owner_user_id=other_merchant_id)

    response = client.get(
        "/api/v1/merchant/reservations", headers={"X-User-Id": str(merchant.id)}
    )

    assert response.status_code == 200
    body = response.json()["data"]
    assert all(r["id"] != reservation.id for r in body)


def test_complete_pickup_transitions_status(client, db_session) -> None:
    merchant, reservation = _seed_reservation(db_session)

    response = client.put(
        f"/api/v1/merchant/reservations/{reservation.id}/pickup",
        headers={"X-User-Id": str(merchant.id)},
    )

    assert response.status_code == 200
    assert response.json()["data"]["status"] == "픽업완료"

    second = client.put(
        f"/api/v1/merchant/reservations/{reservation.id}/pickup",
        headers={"X-User-Id": str(merchant.id)},
    )
    assert second.status_code == 400
