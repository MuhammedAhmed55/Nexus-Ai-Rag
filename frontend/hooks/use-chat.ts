import { useState, useCallback, useEffect } from 'react';
import { ChatService } from '../services/chat.service';
import { MessageOut } from '../types/chat';

export function useChat(initialConversationId?: string) {
    const [messages, setMessages] = useState<MessageOut[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);

    useEffect(() => {
        if (initialConversationId) {
            const loadMessages = async () => {
                setIsLoading(true);
                const { data, error } = await ChatService.getConversationMessages(initialConversationId);
                if (data && !error) {
                    setMessages(data);
                } else {
                    setError(error?.message || "Failed to load messages");
                }
                setIsLoading(false);
            };
            loadMessages();
        }
    }, [initialConversationId]);

    const sendMessage = useCallback(async (content: string, documentIds: string[] = []) => {
        setIsLoading(true);
        setError(null);

        // Add user message optimistically
        const userMessage: MessageOut = {
            id: crypto.randomUUID(),
            conversation_id: conversationId || "",
            role: "user",
            content,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);

        const { data, error: apiError } = await ChatService.sendMessage({
            message: content,
            conversation_id: conversationId,
            document_ids: documentIds.length > 0 ? documentIds : undefined
        });

        setIsLoading(false);

        if (apiError || !data) {
            setError(apiError?.message || "Failed to send message");
            return;
        }

        if (data.conversation_id && !conversationId) {
            setConversationId(data.conversation_id);
        }

        setMessages(prev => [...prev, data]);
    }, [conversationId]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        conversationId
    };
}
