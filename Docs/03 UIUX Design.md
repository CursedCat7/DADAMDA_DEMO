# =====================================================================
# MASTER_PLAN.md
# PART 3
# UI / UX Design
# Information Architecture
# =====================================================================

# 26. UX Philosophy

DaDamDa의 UX는

"3 Touch Rule"

을 따른다.

사용자는

3번 이내의 터치로

원하는 상품을 예약할 수 있어야 한다.

목표

Home

↓

Market

↓

Reservation

끝.

절대로 복잡한 화면을 만들지 않는다.

---

# UX Keywords

Simple

Fast

Friendly

Fresh

Local

---

UI Style

Apple Wallet

+

Toss

+

Karrot

+

Baemin

느낌

---

# 27. Target Device

Primary

iPhone Safari

Android Chrome

---

Screen Width

390px

428px

430px

반응형

지원

---

Desktop

관리자 화면 중심

---

# 28. User Flow

Visitor

↓

QR Scan

↓

Landing

↓

Home

↓

Market

↓

Store

↓

Product

↓

Reservation

↓

QR

↓

Pickup

↓

Complete

---

Merchant Flow

Merchant Login

↓

Dashboard

↓

Product Upload

↓

Reservation List

↓

Pickup Check

↓

Complete

---

Admin

Dashboard

↓

Statistics

↓

Reservation

↓

Store Management

---

# 29. Information Architecture

ROOT

│

├── Splash

├── Home

├── Market

│      ├── Market Detail

│      ├── Category

│      ├── Store

│      └── Product

│

├── Reservation

│

├── Favorite

│

├── Notification

│

├── My

│

└── Admin

---

Bottom Navigation

🏠 Home

🗺 Market

❤️ Favorite

📦 Reservation

👤 My

---

# 30. Screen List

총 MVP 화면

01 Splash

02 Landing

03 Home

04 Market List

05 Market Detail

06 Store Detail

07 Product Detail

08 Reservation

09 QR

10 Reservation History

11 Favorite

12 Notification

13 My Page

14 Merchant Dashboard

15 Product Upload

16 Reservation Management

17 ESG Dashboard

---

# 31. Splash

목적

브랜드 인식

구성

Logo

DaDamDa

Loading

Animation

2초

---

# 32. Landing

슬로건

오늘의 남은 가치를 담다.

버튼

시작하기

데모 시작

---

# 33. Home

상단

현재 위치

예시

📍 인천 남동구

---

검색

"시장을 검색하세요"

---

오늘의 할인

Carousel

예시

모래내시장

32개 할인

최대 40%

---

추천시장

Card

---

Quick Menu

반찬

정육

과일

생선

떡

분식

---

오늘의 ESG

오늘

18kg

폐기 감소

---

# 34. Market List

지도

Kakao Map

↓

현재 위치

↓

시장 Marker

---

Market Card

모래내시장

오늘 할인

32

평균 할인

34%

거리

420m

---

Bottom Sheet

입장하기

---

# 35. Market Detail

Hero Image

시장 사진

---

시장명

운영시간

오늘 할인

상점 수

---

Category

반찬

생선

정육

과일

분식

떡

---

Store List

Card

---

# 36. Store Detail

Store Image

---

Store Name

---

평점

---

오늘 할인

---

대표상품

---

예약 가능

---

# 37. Product Detail

상품 이미지

---

상품명

---

정가

8,000

↓

할인가

5,600

---

할인율

30%

---

남은 수량

3

---

픽업 가능

18:40

---

예약하기

Primary Button

---

# 38. Reservation

상품

시간

수량

가격

---

예약 버튼

↓

Loading

↓

Complete

---

# 39. Reservation Complete

예약 성공

Animation

---

예약번호

M-2026-0012

---

QR Code

---

픽업 안내

18:40

---

홈으로

버튼

---

# 40. Reservation History

예약목록

진행중

완료

취소

---

Card

예약번호

시장

상품

상태

---

# 41. Favorite

즐겨찾기

시장

상품

---

Push 설정

---

# 42. Notification

오늘 할인

예약 완료

픽업 알림

---

Mock Data

---

# 43. My

닉네임

---

예약 수

---

절약금액

---

ESG 기여

---

# 44. Merchant Dashboard

오늘 예약

12

---

오늘 매출

182,000

---

오늘 폐기 감소

8kg

---

예약현황

---

# 45. Product Upload

사진

상품명

가격

할인가

남은수량

픽업시간

등록

---

# 46. Reservation Management

예약번호

상품

수량

시간

QR 확인

↓

수령 완료

---

# 47. ESG Dashboard

오늘

폐기 감소

18kg

---

CO₂

4.3kg

---

추가매출

182,000원

---

월간 통계

Mock

---

# 48. Color System

Primary

#FF6B35

(Orange)

---

Secondary

#2E7D32

(Green)

---

Background

#F7F8FA

---

Card

#FFFFFF

---

Danger

#FF4D4F

---

Success

#00C853

---

# 49. Typography

Pretendard

---

Title

Bold

---

Body

Regular

---

Button

SemiBold

---

# 50. Component Library

Button

Card

Badge

Bottom Sheet

Modal

Dialog

Toast

QR Card

Market Card

Store Card

Product Card

Category Chip

ESG Widget

Reservation Tile

Statistic Card

Search Bar

Map Marker

Floating Button

---

# 51. Motion

Duration

200ms

---

Screen Transition

Slide

---

Bottom Sheet

Spring

---

Reservation

Success Animation

Lottie

---

# 52. Accessibility

Touch Area

48px

---

Contrast

WCAG AA

---

Dynamic Font

지원

---

# 53. Demo Script

발표자는

QR 생성

↓

청중 접속

↓

모래내시장

↓

반찬

↓

예약

↓

QR 생성

↓

상인 화면

↓

예약 확인

↓

수령 완료

약

90초

---

# End of Part 3

Next

Part 4

Database Design

ERD

API

FastAPI Architecture

SQLAlchemy

Authentication

Redis

Swagger