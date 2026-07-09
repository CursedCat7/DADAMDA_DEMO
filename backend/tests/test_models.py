from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy.exc import IntegrityError

from app.models import (
    ESGStat,
    Favorite,
    Market,
    Notification,
    Product,
    Reservation,
    ReservationItem,
    Store,
    User,
)
from app.models.enums import (
    ProductStatus,
    ReservationStatus,
    StoreCategory,
    UserRole,
)


def test_reservation_chain_persists_with_relationships(db_session) -> None:
    now = datetime.now(timezone.utc)

    merchant = User(nickname="박영희", email="merchant@example.com", role=UserRole.MERCHANT)
    consumer = User(nickname="김민수", email="consumer@example.com", role=UserRole.USER)
    db_session.add_all([merchant, consumer])
    db_session.flush()

    market = Market(
        name="모래내시장",
        address="인천 서구 모래내로",
        latitude=37.505,
        longitude=126.677,
    )
    db_session.add(market)
    db_session.flush()

    store = Store(
        market_id=market.id,
        owner_user_id=merchant.id,
        name="영희반찬",
        category=StoreCategory.BANCHAN,
        owner_name="박영희",
    )
    db_session.add(store)
    db_session.flush()

    product = Product(
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
    db_session.add(product)
    db_session.flush()

    reservation = Reservation(
        reservation_number="M20260001",
        user_id=consumer.id,
        total_price=5600,
        status=ReservationStatus.RESERVED,
        pickup_time=now + timedelta(minutes=30),
    )
    db_session.add(reservation)
    db_session.flush()

    db_session.add(
        ReservationItem(
            reservation_id=reservation.id,
            product_id=product.id,
            quantity=1,
            price=5600,
        )
    )
    db_session.add(Favorite(user_id=consumer.id, market_id=market.id))
    db_session.add(
        Notification(
            user_id=consumer.id,
            title="예약 완료",
            body="M20260001 예약이 완료되었습니다.",
            type="RESERVATION_COMPLETE",
        )
    )
    db_session.add(ESGStat(market_id=market.id, saved_food_kg=0.4, saved_co2=0.1, saved_money=2400))
    db_session.flush()

    persisted_item = db_session.query(ReservationItem).filter_by(
        reservation_id=reservation.id
    ).one()
    assert persisted_item.product_id == product.id
    assert persisted_item.quantity == 1

    persisted_store = db_session.query(Store).filter_by(id=store.id).one()
    assert persisted_store.owner_user_id == merchant.id
    assert persisted_store.category == StoreCategory.BANCHAN


def test_favorite_unique_constraint_rejects_duplicate(db_session) -> None:
    user = User(nickname="김민수", email="dup-consumer@example.com", role=UserRole.USER)
    market = Market(
        name="모래내시장",
        address="인천 서구 모래내로",
        latitude=37.505,
        longitude=126.677,
    )
    db_session.add_all([user, market])
    db_session.flush()

    db_session.add(Favorite(user_id=user.id, market_id=market.id))
    db_session.flush()

    db_session.add(Favorite(user_id=user.id, market_id=market.id))
    with pytest.raises(IntegrityError):
        db_session.flush()
