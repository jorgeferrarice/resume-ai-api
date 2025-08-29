import { Response } from 'express';
import { ApiResponse, ChatRequest, ChatResponse, TypedRequest } from '../types';
export declare const sendChatMessage: (req: TypedRequest<ChatRequest>, res: Response<ApiResponse<ChatResponse>>) => Promise<void>;
export declare const getConversationHistory: (req: TypedRequest<{
    conversationId: string;
}>, res: Response<ApiResponse<any>>) => Promise<void>;
export declare const deleteConversation: (req: TypedRequest<{
    conversationId: string;
}>, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const getAllConversations: (_req: TypedRequest, res: Response<ApiResponse<any[]>>) => Promise<void>;
export declare const cleanupOldConversations: (req: TypedRequest<{
    maxAgeHours?: number;
}>, res: Response<ApiResponse<{
    deletedCount: number;
}>>) => Promise<void>;
//# sourceMappingURL=chatController.d.ts.map