from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health, market, store
from app.core.config import settings
from app.core.exception_handlers import register_exception_handlers
from app.core.logging import setup_logging
from app.middleware.logging import RequestLoggingMiddleware

setup_logging()

app = FastAPI(title="DaDamDa API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)

register_exception_handlers(app)

app.include_router(health.router)
app.include_router(market.router)
app.include_router(store.router)
