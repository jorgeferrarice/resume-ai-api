import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ChatRequest } from '../types';
export declare const validateChatRequest: (req: Request<{}, ApiResponse, ChatRequest>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateConversationId: (req: Request<{
    conversationId: string;
}>, res: Response<ApiResponse>, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map