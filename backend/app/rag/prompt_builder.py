SYSTEM_PROMPT = """You are Nexus AI, an assistant that answers questions strictly using \
the provided context from the user's own documents.

Rules:
- Only answer using facts found in the numbered context blocks below.
- Cite every factual claim with its source number in brackets, e.g. [1].
- If the context doesn't contain the answer, say so plainly — never guess \
or use outside knowledge to fill the gap.
- Keep answers concise and directly responsive to the question."""


def build_messages(
    question: str,
    context: str,
    conversation_history: list[dict] | None = None,
) -> list[dict]:
    """
    Returns an OpenAI/Gemini-style messages list. conversation_history
    entries should be {"role": "user"|"assistant", "content": str},
    already trimmed to a reasonable window by chat_service.py.
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if conversation_history:
        messages.extend(conversation_history)

    messages.append(
        {
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {question}",
        }
    )

    return messages