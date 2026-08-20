from app.core.config import get_settings
from app.models.ingestion import RawChunk

# Try to split on paragraph/sentence boundaries before falling back
# to hard character cuts — keeps chunks semantically coherent.
_SEPARATORS = ["\n\n", "\n", ". ", " ", ""]


def _split_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    if len(text) <= chunk_size:
        return [text]

    for sep in _SEPARATORS:
        if sep == "":
            break
        parts = text.split(sep)
        if len(parts) > 1:
            pieces: list[str] = []
            current = ""
            for part in parts:
                candidate = current + (sep if current else "") + part
                if len(candidate) <= chunk_size:
                    current = candidate
                else:
                    if current:
                        pieces.append(current)
                    current = part
            if current:
                pieces.append(current)

            # apply overlap by carrying the tail of each piece into the next
            overlapped: list[str] = []
            for i, piece in enumerate(pieces):
                if i > 0 and overlap > 0:
                    tail = pieces[i - 1][-overlap:]
                    piece = tail + piece
                overlapped.append(piece)
            return overlapped

    # last resort: hard character split
    return [text[i : i + chunk_size] for i in range(0, len(text), chunk_size - overlap)]


def chunk_documents(raw_chunks: list[RawChunk]) -> list[RawChunk]:
    """
    Takes loader output (often one RawChunk per page/row) and splits any
    oversized ones further, re-numbering chunk_index while preserving
    page_number and metadata for citations.
    """
    settings = get_settings()
    result: list[RawChunk] = []
    running_index = 0

    for raw in raw_chunks:
        pieces = _split_text(raw.content, settings.chunk_size, settings.chunk_overlap)
        for piece in pieces:
            result.append(
                RawChunk(
                    content=piece.strip(),
                    page_number=raw.page_number,
                    chunk_index=running_index,
                    metadata=raw.metadata,
                )
            )
            running_index += 1

    return [c for c in result if c.content]