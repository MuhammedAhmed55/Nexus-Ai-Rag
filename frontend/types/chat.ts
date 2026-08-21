export interface ChatRequest {
    message: string;
    conversation_id?: string;
    document_ids?: string[];
}

export interface MessageSourceOut {
    chunk_id: string;
    document_id: string;
    document_name: string;
    content: string;
    page_number?: number;
    similarity_score: number;
}

export interface MessageOut {
    id: string;
    conversation_id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
    sources?: MessageSourceOut[];
}
