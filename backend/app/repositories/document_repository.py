from uuid import UUID

from app.repositories.vector_repository import get_supabase


async def create_document(
    document_id: UUID,
    user_id: UUID,
    name: str,
    file_type: str | None = None,
    file_size: int | None = None,
    source_type: str = "upload",
    source_url: str | None = None,
) -> None:
    """
    Must run BEFORE any document_chunks are inserted — document_chunks.document_id
    has a foreign key against this table, so skipping this step is what caused
    the '23503 foreign key violation' you just hit.
    """
    supabase = get_supabase()
    supabase.table("documents").insert({
        "id": str(document_id),
        "user_id": str(user_id),
        "name": name,
        "file_type": file_type,
        "file_size": file_size,
        "source_type": source_type,
        "source_url": source_url,
        "status": "pending",
    }).execute()


async def update_document_status(
    document_id: UUID,
    status: str,
    chunk_count: int | None = None,
    error_message: str | None = None,
) -> None:
    supabase = get_supabase()
    payload = {"status": status}
    if chunk_count is not None:
        payload["chunk_count"] = chunk_count
    if error_message is not None:
        payload["error_message"] = error_message

    supabase.table("documents").update(payload).eq("id", str(document_id)).execute()


async def get_document_names(document_ids: list[UUID]) -> dict[UUID, str]:
    """
    Batch-fetches {document_id: name} for a set of documents in one query.
    Used by chat_service.py to resolve real filenames for source citations —
    chunk metadata never carried the filename, only source_type, so looking
    it up here (instead of trusting metadata) fixes 'Unknown Document' for
    every already-ingested document too, not just future uploads.
    """
    if not document_ids:
        return {}

    supabase = get_supabase()
    response = (
        supabase.table("documents")
        .select("id, name")
        .in_("id", [str(did) for did in document_ids])
        .execute()
    )
    return {UUID(row["id"]): row["name"] for row in response.data}


async def get_documents(user_id: UUID) -> list[dict]:
    supabase = get_supabase()
    response = (
        supabase.table("documents")
        .select("*")
        .eq("user_id", str(user_id))
        .order("created_at", desc=True)
        .execute()
    )
    return response.data

async def delete_document(document_id: UUID, user_id: UUID) -> None:
    supabase = get_supabase()
    # Ensure the user owns the document before deleting
    supabase.table("documents").delete().eq("id", str(document_id)).eq("user_id", str(user_id)).execute()