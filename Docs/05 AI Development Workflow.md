# =====================================================================
# MASTER_PLAN.md
# PART 5
# AI Development Workflow
# Sprint Planning
# Deployment
# =====================================================================

# 70. AI Development Philosophy

DaDamDa 프로젝트는

"AI-First Development"

방식을 따른다.

AI는 단순한 코드 생성기가 아니라

하나의 Junior Developer로 간주한다.

모든 작업은

작은 단위(Task)로 분리하여 수행한다.

절대로

"앱 전체를 만들어줘"

와 같은 거대한 작업을 수행하지 않는다.

---

# 71. AI Agent Rules

Claude Code / Cursor / Codex / Gemini CLI 공통 규칙

항상

한 번에

Task 하나만 수행한다.

완료 후

테스트

↓

Lint

↓

Build

↓

Commit

↓

다음 Task

순으로 진행한다.

---

절대 금지

❌ TODO만 남기기

❌ 미완성 코드 Commit

❌ Hard Coding

❌ Any 남발

❌ Deprecated API 사용

❌ Docker 밖에서 실행되는 코드 작성

❌ 테스트 없는 핵심 기능 구현

---

항상 지켜야 할 사항

✔ TypeScript Strict

✔ Pydantic Validation

✔ SQLAlchemy ORM 사용

✔ Swagger 자동 생성

✔ Docker Build 성공

✔ Responsive UI 유지

✔ API 문서 동기화

---

# 72. Development Workflow

Epic 생성

↓

Sprint 생성

↓

Task 생성

↓

Claude Code 구현

↓

Review

↓

Merge

↓

Deploy

↓

Demo

---

# 73. Epic Planning

Epic 1

프로젝트 초기화

- Docker Compose
- Next.js
- FastAPI
- PostgreSQL
- Redis
- Nginx

---

Epic 2

Frontend

- Splash
- Landing
- Home
- Market
- Product
- Reservation
- QR

---

Epic 3

Backend

- CRUD
- Reservation
- Notification
- Favorite
- Merchant

---

Epic 4

Admin

- Dashboard
- Product Upload
- Reservation Check
- ESG

---

Epic 5

Deployment

- Docker
- Cloudflare Tunnel
- HTTPS
- QR Demo

---

# 74. Sprint Plan

Sprint 1 (Day 1)

프로젝트 생성

완료 조건

Docker Compose 실행

---

Sprint 2 (Day 2)

Frontend MVP

완료 조건

모든 화면 렌더링

---

Sprint 3 (Day 3)

Backend CRUD

완료 조건

Swagger 완성

---

Sprint 4 (Day 4)

예약 시스템

완료 조건

예약 생성

QR 생성

---

Sprint 5 (Day 5)

상인 페이지

완료 조건

상품 등록

예약 확인

---

Sprint 6 (Day 6)

발표 데모

완료 조건

QR 접속

90초 시연 성공

---

# 75. Task Breakdown

Task 001

Docker Compose 작성

---

Task 002

Next.js 프로젝트 생성

---

Task 003

FastAPI 프로젝트 생성

---

Task 004

DB 연결

---

Task 005

Market API

---

Task 006

Store API

---

Task 007

Product API

---

Task 008

Reservation API

---

Task 009

QR 생성

---

Task 010

Merchant Dashboard

---

Task 011

ESG Widget

---

Task 012

Cloudflare Tunnel 배포

---

# 76. Git Workflow

main

↓

develop

↓

feature/*

↓

Pull Request

↓

Code Review

↓

Merge

---

Commit Convention

feat:

fix:

docs:

style:

test:

refactor:

chore:

---

예시

feat: implement reservation api

fix: resolve market map marker bug

---

# 77. CI/CD

GitHub

↓

GitHub Actions

↓

Docker Build

↓

pytest

↓

ESLint

↓

Type Check

↓

Deploy

---

CI 실패 시

Merge 금지

---

# 78. Logging Policy

Frontend

console.log 제거

운영 빌드 시

Debug 비활성화

---

Backend

INFO

WARNING

ERROR

구분

---

모든 Exception

Logging

필수

---

# 79. Security Policy

환경 변수

.env

사용

---

API Key

Git Commit 금지

---

JWT Secret

환경 변수 관리

---

CORS

허용 Origin 제한

---

Rate Limit

향후 적용

---

# 80. Performance Goal

첫 화면

2초 이내

---

API 평균 응답

300ms 이하

---

Lighthouse

90+

---

CLS

0.1 이하

---

Docker Build

5분 이내

---

# 81. Demo Script

발표자는

QR 코드 출력

↓

청중 접속

↓

홈 화면

↓

현재 위치

인천 남동구

↓

모래내시장 선택

↓

오늘 할인

↓

반찬집

↓

상품 선택

↓

예약

↓

QR 생성

↓

상인 화면

↓

QR 확인

↓

수령 완료

↓

ESG 화면

↓

종료

총 소요

약 90초

---

# 82. Future Roadmap

Phase 1

MVP

- 예약
- 할인
- QR

---

Phase 2

Market Expansion

- 인천 전역
- 시장 20곳

---

Phase 3

AI

- 할인율 추천
- 수요 예측
- 재고 예측

---

Phase 4

Logistics

- 배달
- 공동배송
- 픽업 스테이션

---

Phase 5

Market OS

- POS 연동
- ERP
- CRM
- AI 운영

---

# 83. Success Metrics (KPI)

MVP Demo

QR 접속 성공률 > 95%

예약 완료율 > 90%

페이지 로딩 < 2초

발표 데모 오류 0건

---

Pilot 목표

참여 시장 1곳

참여 상점 10곳

등록 상품 100개

예약 300건

폐기 감소 20%

---

# 84. Definition of Done

프로젝트는 다음 조건을 모두 만족해야 완료로 간주한다.

□ Docker Compose 한 번으로 실행

□ 모든 서비스 Health Check 정상

□ 모바일 Web 대응

□ 카카오맵 정상 표시

□ 모래내시장 Demo 데이터 탑재

□ 상품 예약 가능

□ QR 생성 가능

□ 상인 예약 확인 가능

□ Swagger 문서 최신화

□ 테스트 통과

□ 발표 시나리오 90초 이내 완료

□ README 최신화

---

# 85. Project Vision

DaDamDa는 단순한 할인 플랫폼이 아니다.

우리는

전통시장을

"검색 가능한 시장"

"예약 가능한 시장"

"데이터 기반 시장"

으로 전환하는 것을 목표로 한다.

MVP는 시작일 뿐이며,

최종적으로는

대한민국 모든 전통시장의

디지털 운영 플랫폼(Market Operating System)을 구축하는 것이 비전이다.

---

# END OF MASTER PLAN