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
    supabase_url: str
    supabase_service_role_key: str

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