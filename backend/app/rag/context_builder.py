def build_context(retrieved_chunks: list[dict]) -> str:
    """
    Formats retrieved chunks as a numbered block the LLM can cite with
    [1], [2], etc. — those numbers map 1:1 to the `sources` array
    returned alongside the answer, which is what source-citations.tsx
    renders.
    """
    if not retrieved_chunks:
        return "No relevant context was found in the user's documents."

    blocks = []
    for i, chunk in enumerate(retrieved_chunks, start=1):
        page_info = f", page {chunk['page_number']}" if chunk.get("page_number") else ""
        blocks.append(f"[{i}] (source{page_info})\n{chunk['content']}")

    return "\n\n".join(blocks)