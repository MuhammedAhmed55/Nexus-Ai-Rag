from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # LLM Configuration
    ollama_base_url: str = "http://localhost:11434"
    primary_model: str = "llama3.2"
    fallback_model: str = "llama3.2"

    # LangSmith
    langchain_tracing_v2: bool = True
    langsmith_api_key: str = ""
    langchain_project: str = "production-api"

    # Supabase
    supabase_url: str = "https://lempvxwxhkuzaelesybo.supabase.co"
    supabase_service_role_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlbXB2eHd4aGt1emFlbGVzeWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjYzODY5OSwiZXhwIjoyMDcyMjE0Njk5fQ.9h48382nFv58Qz8-QYn3Q-M0lD0u76xN_4_o2yW2hM8"

    # Application
    app_env: str = "development"
    log_level: str = "INFO"
    rate_limit: str = "20/minute"
    cache_ttl_seconds: int = 300
    max_retries: int = 3
    
    # RAG Settings
    chunk_size: int = 1000
    chunk_overlap: int = 200
    embedding_model: str = "mxbai-embed-large"
    retrieval_similarity_threshold: float = 0.5
    retrieval_top_k: int = 4

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    """Cache settings to avoid reloading them multiple times."""
    return Settings()