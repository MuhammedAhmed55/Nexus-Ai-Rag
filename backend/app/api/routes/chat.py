from fastapi import APIRouter, Depends
from uuid import UUID

from app.models.chat import ChatRequest, MessageOut
from app.services.chat_service import process_chat
from app.core.security import get_current_user, CurrentUser

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("", response_model=MessageOut)
async def chat(
    request: ChatRequest,
    current_user: CurrentUser = Depends(get_current_user)
):
    return await process_chat(request, current_user.id)
