import { ChatRequest, OpenAIResponse } from '../types';
export declare class ChatService {
    private readonly elevatrPersonality;
    private loadContext;
    private createSystemMessage;
    sendMessage(request: ChatRequest): Promise<OpenAIResponse>;
    getConversationHistory(conversationId: string): {
        id: string;
        messages: {
            id: string;
            role: "user" | "assistant" | "system";
            content: string;
            timestamp: Date;
        }[];
        createdAt: Date;
        updatedAt: Date;
    } | null;
    deleteConversation(conversationId: string): boolean;
    private getMockElevatrResponse;
}
export declare const chatService: ChatService;
//# sourceMappingURL=chatService.d.ts.map