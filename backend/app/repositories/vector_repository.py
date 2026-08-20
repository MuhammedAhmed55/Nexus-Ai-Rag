from uuid import UUID
from supabase import create_client, Client

from app.core.config import get_settings
from app.models.ingestion import EmbeddedChunk

_supabase: Client | None = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        settings = get_settings()
        _supabase = create_client(
            settings.supabase_url,
            settings.supabase_service_role_key
        )
    return _supabase

async def store_chunks(chunks: list[EmbeddedChunk], document_id: UUID, user_id: UUID) -> None:
    """Stores a list of embedded chunks into the Supabase database."""
    supabase = get_supabase()

    records = []
    for chunk in chunks:
        records.append({
            "document_id": str(document_id),
            "user_id": str(user_id),
            "content": chunk.content,
            "page_number": chunk.page_number,
            "chunk_index": chunk.chunk_index,
            "metadata": chunk.metadata,
            "embedding": chunk.embedding,
        })

    if records:
        # Supabase Python client is synchronous for standard inserts
        supabase.table("document_chunks").insert(records).execute()

async def search_chunks(
    query_embedding: list[float],
    user_id: UUID,
    document_ids: list[UUID] | None = None,
    match_threshold: float = 0.5,
    match_count: int = 4,
) -> list[dict]:
    """
    Calls the Supabase RPC function `match_document_chunks` to perform
    vector similarity search.
    """
    supabase = get_supabase()

    args = {
        "query_embedding": query_embedding,
        "match_threshold": match_threshold,
        "match_count": match_count,
        "p_user_id": str(user_id)
    }

    if document_ids:
        args["p_document_ids"] = [str(did) for did in document_ids]
    else:
        args["p_document_ids"] = None

    response = supabase.rpc("match_document_chunks", args).execute()
    return response.data