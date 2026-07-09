from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "development"
    log_level: str = "INFO"

    database_url: str
    redis_url: str
    jwt_secret: str

    cors_origins: list[str] = ["http://localhost", "http://localhost:3000"]


settings = Settings()
