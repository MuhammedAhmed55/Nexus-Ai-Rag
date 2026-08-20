from langchain_ollama import OllamaEmbeddings

from app.core.config import get_settings


_embeddings: OllamaEmbeddings | None = None


def _get_embeddings() -> OllamaEmbeddings:
    global _embeddings

    if _embeddings is None:
        settings = get_settings()

        _embeddings = OllamaEmbeddings(
            model=settings.embedding_model,
            base_url=settings.ollama_base_url,
        )

    return _embeddings


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Convert document chunks into embeddings using Ollama.

    The same embedding model must be used for both documents
    and queries.
    """

    embeddings = _get_embeddings()

    return await embeddings.aembed_documents(texts)


async def embed_query(query: str) -> list[float]:
    """
    Convert a user's query into an embedding using the same
    Ollama embedding model used for document chunks.
    """

    embeddings = _get_embeddings()

    return await embeddings.aembed_query(query)