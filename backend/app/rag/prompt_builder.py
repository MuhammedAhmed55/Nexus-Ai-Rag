SYSTEM_PROMPT = """You are Nexus AI, a helpful and conversational assistant.

Rules:
- If the user provides document context below, prioritize using it to answer their questions accurately.
- When using provided context, cite every factual claim with its source number in brackets, e.g. [1].
- If the user asks a general question or just wants to chat (e.g., "hi", "how are you", "write a poem"), answer normally using your general knowledge as a friendly AI assistant.
- If the user specifically asks about a document but the context doesn't contain the answer, say so plainly.
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

    if context and context.strip():
        messages.append(
            {
                "role": "user",
                "content": f"Context:\n{context}\n\nQuestion: {question}",
            }
        )
    else:
        messages.append(
            {
                "role": "user",
                "content": question,
            }
        )

    return messages