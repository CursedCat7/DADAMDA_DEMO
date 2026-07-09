# =====================================================================
# MASTER_PLAN.md
# PART 4
# Backend Architecture
# Database Design
# API Specification
# =====================================================================

# 54. Backend Philosophy

Backend는

"Frontend First"

개발을 지원한다.

모든 API는

RESTful

JSON

OpenAPI(Swagger)

기반으로 구현한다.

FastAPI는

Business Logic

Database

API

를 명확히 분리한다.

---

# 55. Backend Folder Structure

backend/

├── app/

│   ├── api/

│   │      ├── market.py

│   │      ├── store.py

│   │      ├── product.py

│   │      ├── reservation.py

│   │      ├── notification.py

│   │      ├── admin.py

│   │

│   ├── crud/

│   │

│   ├── db/

│   │

│   ├── models/

│   │

│   ├── schemas/

│   │

│   ├── services/

│   │

│   ├── core/

│   │

│   ├── middleware/

│   │

│   ├── utils/

│   │

│   └── main.py

---

# 56. Database ERD

MVP Entity

User

↓

Favorite

↓

Market

↓

Store

↓

Product

↓

Reservation

↓

ReservationItem

↓

Notification

↓

ESGStat

---

ER Diagram

User

│

├──── Favorite

│

└──── Reservation

Reservation

│

└──── ReservationItem

ReservationItem

│

└──── Product

Product

│

└──── Store

Store

│

└──── Market

---

# 57. Table Design

## User

id

uuid

nickname

email

phone

role

created_at

updated_at

---

Role

USER

MERCHANT

ADMIN

---

## Market

id

name

address

latitude

longitude

description

thumbnail

phone

open_time

close_time

created_at

---

Example

모래내시장

---

## Store

id

market_id

name

category

description

phone

owner_name

thumbnail

created_at

---

Category

반찬

생선

정육

과일

떡

분식

채소

기타

---

## Product

id

store_id

title

description

original_price

discount_price

discount_percent

remain_quantity

pickup_start

pickup_end

image_url

status

created_at

updated_at

---

Status

판매중

예약마감

품절

종료

---

## Reservation

id

reservation_number

user_id

total_price

status

pickup_time

created_at

---

Status

예약중

픽업완료

취소

---

## ReservationItem

id

reservation_id

product_id

quantity

price

---

## Favorite

id

user_id

market_id

---

## Notification

id

user_id

title

body

type

is_read

created_at

---

## ESGStat

id

market_id

saved_food_kg

saved_co2

saved_money

created_at

---

# 58. API Convention

Base URL

/api/v1

---

GET

조회

POST

생성

PUT

수정

DELETE

삭제

---

모든 응답

application/json

---

# 59. API List

Market

GET /markets

GET /markets/{id}

GET /markets/{id}/stores

---

Store

GET /stores/{id}

GET /stores/{id}/products

---

Product

GET /products

GET /products/{id}

---

Reservation

POST /reservations

GET /reservations

GET /reservations/{id}

DELETE /reservations/{id}

---

Favorite

GET /favorites

POST /favorites

DELETE /favorites/{id}

---

Notification

GET /notifications

PUT /notifications/read

---

Merchant

GET /merchant/dashboard

POST /merchant/products

PUT /merchant/products/{id}

DELETE /merchant/products/{id}

GET /merchant/reservations

---

ESG

GET /esg

---

Health

GET /health

---

# 60. Example Response

GET /markets

{
  "success": true,
  "data": [
    {
      "id":1,
      "name":"모래내시장",
      "discountCount":32
    }
  ]
}

---

Reservation

POST

/reservations

Request

{
    "productId":1,
    "quantity":1
}

Response

{
    "success":true,
    "reservationNumber":"M20260012"
}

---

# 61. Business Logic

Reservation

Product 조회

↓

재고 확인

↓

재고 감소

↓

예약 생성

↓

QR 생성

↓

완료

---

Reservation Cancel

예약 조회

↓

재고 복원

↓

예약 취소

↓

완료

---

# 62. QR Policy

QR 내용

Reservation Number

예약번호만 포함

예

M20260021

---

QR Scan

↓

예약 조회

↓

수령 완료

---

# 63. Authentication

Demo

Mock Login

사용자 선택

직장인

↓

Merchant 선택

↓

상인 화면

---

운영

JWT

Access Token

Refresh Token

---

# 64. Redis Strategy

사용

오늘 할인

인기상품

예약순위

Notification

Session

---

TTL

300초

---

# 65. Scheduler

매분

마감시간 확인

↓

상품 상태 변경

↓

예약 종료

---

매일 자정

ESG 통계 생성

---

# 66. Kakao Map Integration

DB

Market

↓

latitude

longitude

저장

---

API

현재 위치

↓

가까운 시장

거리 계산

↓

정렬

---

향후

반경검색

500m

1km

3km

지원

---

# 67. Mock Data

Market

1

모래내시장

---

Store

15개

---

Product

100개

---

Reservation

50개

---

Notification

20개

---

ESG

30일

더미 데이터

자동 생성

---

# 68. Test Strategy

pytest

사용

---

Unit Test

CRUD

---

Integration Test

API

---

Swagger Test

자동

---

Coverage

80%

이상

---

# 69. Definition of Backend Done

Swagger 정상

Docker Build 성공

Migration 성공

API 정상

Dummy Data 생성

Health Check 성공

pytest 통과

---

# End of Part 4

Next

Part 5

Claude Code Rules

Development Workflow

Sprint

Epic

Task

Deployment

CI/CD

Definition of Done

Roadmap