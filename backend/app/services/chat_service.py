from uuid import UUID, uuid4
from datetime import datetime, timezone

from app.models.chat import ChatRequest, MessageOut, MessageSourceOut
from app.core.security import SecurityPipeline
from app.core.cache import ResponseCache
from app.rag.retriever import retrieve
from app.rag.context_builder import build_context
from app.rag.prompt_builder import build_messages
from app.agents.agent import ProductionAgent
from app.core.monitoring import get_logger
from app.repositories.document_repository import get_document_names

logger = get_logger()
security_pipeline = SecurityPipeline()
response_cache = ResponseCache()
agent = ProductionAgent()

async def process_chat(request: ChatRequest, user_id: UUID) -> MessageOut:
    try:
        conversation_id = request.conversation_id or uuid4()
        
        # 1. Security Check
        is_safe, cleaned_message, notes = security_pipeline.check_input(request.message)
        if not is_safe:
            logger.warning(f"Security check failed for message: {request.message}. Notes: {notes}")
            return MessageOut(
                id=uuid4(),
                conversation_id=conversation_id,
                role="assistant",
                content="Blocked: potential prompt injection detected.",
                created_at=datetime.now(timezone.utc),
            )

        # 2. Cache Lookup
        docs_str = ",".join([str(did) for did in request.document_ids]) if request.document_ids else "all"
        cache_key = f"{cleaned_message}_{conversation_id}_{docs_str}"
        cached_response = response_cache.get(cache_key)
        if cached_response:
            logger.info("Cache hit for chat request")
            return MessageOut(
                id=uuid4(),
                conversation_id=conversation_id,
                role="assistant",
                content=cached_response,
                created_at=datetime.now(timezone.utc),
            )

        # 3. Retrieve chunks
        logger.info(f"Retrieving chunks for query: {cleaned_message}")
        chunks = await retrieve(
            query=cleaned_message,
            user_id=user_id,
            document_ids=request.document_ids
        )

        # Resolve real filenames in one batch query instead of trusting
        # chunk metadata, which never actually carried a "filename" key —
        # that's what was producing "Unknown Document" every time.
        distinct_doc_ids = list({UUID(chunk["document_id"]) for chunk in chunks})
        doc_names = await get_document_names(distinct_doc_ids)

        sources = []
        for chunk in chunks:
            doc_id = UUID(chunk["document_id"])
            sources.append(MessageSourceOut(
                chunk_id=UUID(chunk["id"]),
                document_id=doc_id,
                document_name=doc_names.get(doc_id, "Unknown Document"),
                content=chunk["content"],
                page_number=chunk.get("page_number"),
                similarity_score=chunk.get("similarity", 0.0)
            ))

        # 4. Build context
        context = build_context(chunks)

        # 5. Build prompt
        messages = build_messages(cleaned_message, context, [])

        # 6. Call Agent
        logger.info("Calling LLM agent")
        result = agent.invoke(messages)
        
        if result["error"]:
            logger.error(f"Agent error: {result['error']}")
            raise Exception(result["error"])

        response_content = result["response"]
        
        # 7. Validate output
        validated_response, warnings = security_pipeline.check_output(response_content)
        if warnings:
            logger.warning(f"Security warnings on output: {warnings}")
            
        # 8. Update Cache
        response_cache.set(cache_key, validated_response)

        return MessageOut(
            id=uuid4(),
            conversation_id=conversation_id,
            role="assistant",
            content=validated_response,
            created_at=datetime.now(timezone.utc),
            sources=sources
        )

    except Exception as e:
        logger.error(f"Chat processing failed: {e}")
        return MessageOut(
            id=uuid4(),
            conversation_id=request.conversation_id or uuid4(),
            role="assistant",
            content="I'm sorry, I encountered an error while processing your request.",
            created_at=datetime.now(timezone.utc),
        )