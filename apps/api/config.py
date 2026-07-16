"""CareCopilot API — Configuration via environment variables."""

from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # JWT
    jwt_secret: str = "carecopilot-demo-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiry_minutes: int = 480

    # Database
    database_url: str = "sqlite+aiosqlite:///../../data/healthcare.db"

    # LLM
    groq_api_key: str = ""
    google_api_key: str = ""

    # CORS
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def llm_available(self) -> bool:
        return bool(self.groq_api_key) or bool(self.google_api_key)

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), ".env")
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
