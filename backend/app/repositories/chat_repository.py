from uuid import UUID
from datetime import datetime, timezone
import logging

from app.repositories.vector_repository import get_supabase

logger = logging.getLogger(__name__)

async def create_conversation(conversation_id: UUID, user_id: UUID, title: str = "New Chat") -> None:
    supabase = get_supabase()
    supabase.table("conversations").insert({
        "id": str(conversation_id),
        "user_id": str(user_id),
        "title": title
    }).execute()

async def get_conversations(user_id: UUID) -> list[dict]:
    supabase = get_supabase()
    response = (
        supabase.table("conversations")
        .select("*")
        .eq("user_id", str(user_id))
        .order("updated_at", desc=True)
        .execute()
    )
    return response.data

async def get_conversation(conversation_id: UUID, user_id: UUID) -> dict | None:
    supabase = get_supabase()
    response = (
        supabase.table("conversations")
        .select("*")
        .eq("id", str(conversation_id))
        .eq("user_id", str(user_id))
        .execute()
    )
    if response.data:
        return response.data[0]
    return None

async def create_message(message_id: UUID, conversation_id: UUID, role: str, content: str) -> None:
    supabase = get_supabase()
    supabase.table("messages").insert({
        "id": str(message_id),
        "conversation_id": str(conversation_id),
        "role": role,
        "content": content
    }).execute()

    # Update conversation's updated_at
    supabase.table("conversations").update({
        "updated_at": datetime.now(timezone.utc).isoformat()
    }).eq("id", str(conversation_id)).execute()

async def get_messages(conversation_id: UUID) -> list[dict]:
    supabase = get_supabase()
    response = (
        supabase.table("messages")
        .select("*")
        .eq("conversation_id", str(conversation_id))
        .order("created_at", desc=False)
        .execute()
    )
    return response.data

async def create_message_sources(sources: list[dict]) -> None:
    if not sources:
        return
    supabase = get_supabase()
    supabase.table("message_sources").insert(sources).execute()

async def get_message_sources(message_ids: list[UUID]) -> list[dict]:
    if not message_ids:
        return []
    supabase = get_supabase()
    response = (
        supabase.table("message_sources")
        .select("*, document_chunks(document_id, page_number, documents(name))")
        .in_("message_id", [str(mid) for mid in message_ids])
        .execute()
    )
    return response.data
