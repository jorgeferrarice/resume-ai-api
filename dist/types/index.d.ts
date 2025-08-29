import { Request, Response } from 'express';
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface PaginationInfo {
    current: number;
    total: number;
    count: number;
    totalItems: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: PaginationInfo;
}
export interface OpenAIResponse {
    success: boolean;
    data?: any;
    error?: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface OpenAIPromptConfig {
    model?: string;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
}
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    conversationId: string;
}
export interface Conversation {
    id: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
    isContextInjected: boolean;
}
export interface ChatRequest {
    message: string;
    conversationId?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface ChatResponse {
    message: string;
    conversationId: string;
    messageId: string;
    isNewConversation: boolean;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface ElevatrContext {
    personalContext: string;
    professionalContext: string;
}
export interface TypedRequest<T = {}> extends Request {
    body: T;
    params: any;
}
export interface TypedResponse<T = any> extends Response {
    json: (body: ApiResponse<T>) => this;
}
//# sourceMappingURL=index.d.ts.map