from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, HttpUrl

DocumentStatus = Literal["pending", "processing", "completed", "failed"]
DocumentSourceType = Literal["upload", "url"]


class DocumentOut(BaseModel):
    id: UUID
    name: str
    file_type: str | None
    file_size: int | None
    source_type: DocumentSourceType
    source_url: str | None
    status: DocumentStatus
    chunk_count: int
    error_message: str | None
    created_at: datetime
    updated_at: datetime


class DocumentCreateFromUrl(BaseModel):
    name: str
    url: HttpUrl