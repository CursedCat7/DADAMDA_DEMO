from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "development"
    log_level: str = "INFO"

    database_url: str
    redis_url: str
    jwt_secret: str

    cors_origins: list[str] = ["http://localhost", "http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def _split_comma_separated(cls, value: str | list[str]) -> str | list[str]:
        # Lets CORS_ORIGINS be set in .env as a plain comma-separated string
        # (e.g. "https://dadamda.duckdns.org,http://localhost:3000") instead
        # of requiring JSON-array syntax, which is easy to get wrong by hand.
        if isinstance(value, str) and not value.strip().startswith("["):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value


settings = Settings()
