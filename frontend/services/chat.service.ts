import { ApiClient } from "./api";
import { ChatRequest, MessageOut } from "@/types/chat";

export class ChatService {
    /**
     * Send a message to the FastAPI chat route
     */
    static async sendMessage(request: ChatRequest): Promise<{ data: MessageOut | null; error: Error | null }> {
        return ApiClient.post("/chat", request);
    }

    /**
     * Get all conversations for the user
     */
    static async getConversations(): Promise<{ data: any; error: Error | null }> {
        return ApiClient.get("/chat");
    }

    /**
     * Get all messages for a specific conversation
     */
    static async getConversationMessages(id: string): Promise<{ data: MessageOut[] | null; error: Error | null }> {
        return ApiClient.get(`/chat/${id}`);
    }
}
