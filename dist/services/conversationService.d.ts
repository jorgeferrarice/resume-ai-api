import { ChatMessage, Conversation } from '../types';
export declare class ConversationService {
    createConversation(): Conversation;
    getConversation(conversationId: string): Conversation | null;
    addMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string): ChatMessage;
    markContextInjected(conversationId: string): void;
    getMessageHistory(conversationId: string, includeSystem?: boolean): Array<{
        role: string;
        content: string;
    }>;
    isFirstUserMessage(conversationId: string): boolean;
    getAllConversations(): Conversation[];
    deleteConversation(conversationId: string): boolean;
    cleanupOldConversations(maxAgeHours?: number): number;
}
export declare const conversationService: ConversationService;
//# sourceMappingURL=conversationService.d.ts.map