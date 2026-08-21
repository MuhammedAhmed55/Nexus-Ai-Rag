from uuid import UUID

from app.core.config import get_settings
from app.rag.embedding import embed_query
from app.repositories.vector_repository import search_chunks
from app.core.monitoring import get_logger

logger = get_logger()

FALLBACK_SIMILARITY_THRESHOLD = 0.35

# Common abbreviations that mean the same thing as a fuller phrase but
# embed differently enough to miss each other in similarity search.
# Expanding the query text before embedding (not after) lets the vector
# actually capture both forms — add to this as you notice more misses.
ACRONYM_EXPANSIONS = {
    "fyp": "final year project",
    "cgpa": "cumulative grade point average",
    "sgpa": "semester grade point average",
    "cv": "resume curriculum vitae",
    "msa": "master service agreement",
}


def _expand_query(query: str) -> str:
    """
    Appends full-form expansions for any acronyms found in the query,
    rather than replacing them — keeps the original wording intact
    (helps if the doc actually uses the acronym somewhere) while adding
    the full phrase the embedding model can match against too.
    """
    lower = query.lower()
    expansions = [
        full for acronym, full in ACRONYM_EXPANSIONS.items()
        if acronym in lower.split() or f"{acronym}?" in lower or f"{acronym}." in lower
    ]
    if not expansions:
        return query
    return f"{query} ({', '.join(expansions)})"


async def retrieve(
    query: str,
    user_id: UUID,
    document_ids: list[UUID] | None = None,
) -> list[dict]:
    """
    Returns ranked chunk dicts (see match_document_chunks() in the SQL
    migration for the exact shape: id, document_id, content, page_number,
    chunk_index, metadata, similarity).
    """
    settings = get_settings()
    expanded_query = _expand_query(query)
    query_embedding = await embed_query(expanded_query)

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