# =====================================================================
# MASTER_PLAN.md
# PART 2
# System Architecture & Technology Stack
# =====================================================================

# 11. System Architecture

## 11.1 Architecture Philosophy

DaDamDa MVP는

"빠른 개발"

"쉬운 유지보수"

"AI 친화적인 구조"

를 목표로 설계한다.

모든 서비스는 Docker Compose 기반으로 실행되며,
각 서비스는 독립적인 컨테이너에서 동작한다.

향후 Kubernetes로의 확장도 고려한 구조를 채택한다.

---

# 11.2 Overall Architecture

                            Internet
                                 │
                                 │
                       Cloudflare Tunnel
                                 │
                                 │
                          Nginx Reverse Proxy
                                 │
                ┌────────────────┴───────────────┐
                │                                │
                │                                │
          Next.js Frontend                 FastAPI Backend
                │                                │
                │                                │
                └──────────────┬─────────────────┘
                               │
                     PostgreSQL Database
                               │
                            Redis Cache

---

# 개발환경

모든 서비스는

Docker Compose

한 번으로 실행된다.

docker compose up -d

만으로 전체 프로젝트가 실행되어야 한다.

---

# 12. Technology Stack

## Frontend

Framework

Next.js 15

Reason

- App Router
- SEO
- 빠른 개발
- React 생태계
- Vercel 호환
- 모바일 Web 최적화

---

Language

TypeScript

Strict Mode 활성화

---

Styling

TailwindCSS

---

UI

shadcn/ui

---

Animation

Framer Motion

---

State

TanStack Query

Zustand

---

Icons

Lucide Icons

---

Form

React Hook Form

Zod

---

Map

Kakao Maps JavaScript API

---

QR

qrcode.react

---

PWA

next-pwa

---

## Backend

Framework

FastAPI

Reason

- Python
- AI 확장
- Swagger
- Async
- 높은 생산성

---

ORM

SQLAlchemy 2

---

Validation

Pydantic

---

Migration

Alembic

---

Authentication

JWT

(단 Demo에서는 Mock)

---

API

REST

(OpenAPI)

---

## Database

PostgreSQL

Version

17

---

Redis

Version

8

용도

- Cache
- Session
- Ranking
- Notification Queue

---

Storage

개발

Local Volume

운영

AWS S3

---

Image Processing

Pillow

---

# 13. Infrastructure

## Reverse Proxy

Nginx

역할

- HTTPS
- API Proxy
- Static File
- Compression
- Cache

---

Cloudflare Tunnel

발표장에서

공유 가능한 URL 생성

QR 연결

---

Docker Compose

Services

frontend

backend

postgres

redis

nginx

---

# 14. Docker Directory

project/

│

├── frontend/

│

├── backend/

│

├── nginx/

│

├── postgres/

│

├── docs/

│

├── docker-compose.yml

│

├── .env

│

└── README.md

---

frontend/

src/

app/

components/

hooks/

services/

types/

store/

styles/

public/

---

backend/

app/

api/

models/

schemas/

crud/

services/

core/

utils/

db/

main.py

---

# 15. Environment Variables

## Frontend

NEXT_PUBLIC_API_URL

NEXT_PUBLIC_KAKAO_MAP_KEY

NEXT_PUBLIC_APP_NAME

NEXT_PUBLIC_VERSION

---

Backend

DATABASE_URL

REDIS_URL

JWT_SECRET

ENV

LOG_LEVEL

---

# 16. Naming Convention

Component

PascalCase

Example

MarketCard.tsx

---

Function

camelCase

getProducts()

---

API

kebab-case

/api/market-list

---

Database

snake_case

market_store

market_product

reservation

---

# 17. Git Strategy

Branch

main

↓

develop

↓

feature/*

↓

fix/*

↓

release/*

---

Commit Convention

feat:

fix:

docs:

refactor:

style:

test:

chore:

---

Example

feat: add reservation api

---

# 18. Folder Philosophy

Component는

Atomic Design을 따른다.

atoms/

molecules/

organisms/

templates/

pages/

---

Business Logic

services/

API

lib/api/

Types

types/

State

store/

---

# 19. Configuration Rule

절대

환경변수를

코드에 하드코딩하지 않는다.

모든 Key는

.env

사용

---

Secret

Git Ignore

필수

---

# 20. Logging

Frontend

Console 제거

---

Backend

Python Logging

INFO

WARNING

ERROR

---

Request Logging

Middleware

사용

---

# 21. Error Handling

Frontend

Global Error Boundary

404

500

Offline

처리

---

Backend

Exception Handler

공통 응답

{
    "success": false,
    "message": "...",
    "data": null
}

---

# 22. Response Format

성공

{
    "success": true,
    "data": {},
    "message": "OK"
}

실패

{
    "success": false,
    "message": "...",
    "error": {}
}

---

# 23. Performance Goal

Lighthouse

90+

---

첫 화면

2초 이내

---

API

500ms 이하

---

Docker Build

5분 이내

---

# 24. MVP Constraints

이번 MVP는

실제 서비스가 아니다.

따라서

로그인

Mock

결제

Mock

AI

Mock

푸시

Mock

GPS

Mock

Demo 중심

---

# 25. Future Expansion

Docker Compose

↓

Docker Swarm

↓

Kubernetes

↓

AWS ECS

↓

Multi Region

까지 고려한다.

---

# End of Part 2

Next

Part 3

UI/UX

Information Architecture

User Flow

Screen Specification

Design System