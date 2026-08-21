from fastapi import APIRouter, Depends
from uuid import UUID

from app.models.chat import ChatRequest, MessageOut, ConversationOut
from app.services.chat_service import process_chat
from app.core.security import get_current_user, CurrentUser
from app.repositories.chat_repository import get_conversations, get_messages

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("", response_model=MessageOut)
async def chat(
    request: ChatRequest,
    current_user: CurrentUser = Depends(get_current_user)
):
    return await process_chat(request, current_user.id)

@router.get("", response_model=list[ConversationOut])
async def list_conversations(
    current_user: CurrentUser = Depends(get_current_user)
):
    return await get_conversations(current_user.id)

@router.get("/{conversation_id}", response_model=list[MessageOut])
async def get_conversation_messages(
    conversation_id: UUID,
    current_user: CurrentUser = Depends(get_current_user)
):
    # Ideally, we should check if the conversation belongs to the user
    # For now, just return messages
    return await get_messages(conversation_id)
