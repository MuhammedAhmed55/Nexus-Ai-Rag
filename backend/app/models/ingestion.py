from uuid import UUID

from pydantic import BaseModel


class IngestionJobResult(BaseModel):
    document_id: UUID
    status: str
    chunk_count: int
    error_message: str | None = None


class RawChunk(BaseModel):
    """Output of a loader, before embedding."""

    content: str
    page_number: int | None = None
    chunk_index: int
    metadata: dict = {}


class EmbeddedChunk(RawChunk):
    """A chunk after it's gone through rag/embedding.py."""

    embedding: list[float]