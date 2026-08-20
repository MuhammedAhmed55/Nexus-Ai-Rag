from uuid import UUID

from app.core.config import get_settings
from app.rag.embedding import embed_query
from app.repositories.vector_repository import search_chunks
from app.core.monitoring import get_logger

logger = get_logger()

# Floor for the fallback pass — loose enough to catch short/casual
# phrasing ("my cgpa?") that scores lower than a full-sentence question
# ("what is my CGPA") despite meaning the same thing, but not so loose
# that it starts pulling in unrelated chunks.
FALLBACK_SIMILARITY_THRESHOLD = 0.35


async def retrieve(
    query: str,
    user_id: UUID,
    document_ids: list[UUID] | None = None,
) -> list[dict]:
    """
    Returns ranked chunk dicts (see match_document_chunks() in the SQL
    migration for the exact shape: id, document_id, content, page_number,
    chunk_index, metadata, similarity).

    Runs a normal-threshold pass first. If that comes back empty, retries
    once at a looser threshold before giving up — short/ambiguous queries
    ("my cgpa?") often score just under the normal cutoff even when the
    answer is clearly present in the document, while a fuller phrasing of
    the same question ("what is my CGPA") clears it fine.
    """
    settings = get_settings()
    query_embedding = await embed_query(query)

    chunks = await search_chunks(
        query_embedding=query_embedding,
        user_id=user_id,
        document_ids=document_ids,
        match_threshold=settings.retrieval_similarity_threshold,
        match_count=settings.retrieval_top_k,
    )

    if not chunks and settings.retrieval_similarity_threshold > FALLBACK_SIMILARITY_THRESHOLD:
        logger.info(
            f"No chunks at threshold={settings.retrieval_similarity_threshold} "
            f"for query='{query}' — retrying at threshold={FALLBACK_SIMILARITY_THRESHOLD}"
        )
        chunks = await search_chunks(
            query_embedding=query_embedding,
            user_id=user_id,
            document_ids=document_ids,
            match_threshold=FALLBACK_SIMILARITY_THRESHOLD,
            match_count=settings.retrieval_top_k,
        )

    return chunks