from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ConversationOut(BaseModel):
    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime


class MessageSourceOut(BaseModel):
    chunk_id: UUID
    document_id: UUID
    document_name: str
    content: str
    page_number: int | None
    similarity_score: float


class MessageOut(BaseModel):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime
    sources: list[MessageSourceOut] = []


class ChatRequest(BaseModel):
    message: str
    conversation_id: UUID | None = None  # omit to start a new conversation
    document_ids: list[UUID] | None = None  # scope retrieval to specific docs


class ChatStreamChunk(BaseModel):
    """One SSE event. `type` tells the frontend how to handle `data`."""

    type: str  # "token" | "sources" | "done" | "error"
    data: str | list[MessageSourceOut] | None = None