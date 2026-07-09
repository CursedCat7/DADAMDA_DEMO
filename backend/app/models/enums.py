import enum


class UserRole(str, enum.Enum):
    USER = "USER"
    MERCHANT = "MERCHANT"
    ADMIN = "ADMIN"


class StoreCategory(str, enum.Enum):
    BANCHAN = "반찬"
    FISH = "생선"
    MEAT = "정육"
    FRUIT = "과일"
    RICE_CAKE = "떡"
    STREET_FOOD = "분식"
    VEGETABLE = "채소"
    ETC = "기타"


class ProductStatus(str, enum.Enum):
    ON_SALE = "판매중"
    RESERVATION_CLOSED = "예약마감"
    SOLD_OUT = "품절"
    ENDED = "종료"


class ReservationStatus(str, enum.Enum):
    RESERVED = "예약중"
    PICKED_UP = "픽업완료"
    CANCELLED = "취소"
