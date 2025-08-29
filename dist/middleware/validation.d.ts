import { Request, Response, NextFunction } from 'express';
import { CreateResumeRequest, ApiResponse, ResumeParams, AnalysisRequest, JobMatchRequest, ChatRequest } from '../types';
export declare const validateResumeData: (req: Request<{}, ApiResponse, CreateResumeRequest>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateIdParam: (req: Request<ResumeParams>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateAnalysisRequest: (req: Request<{}, ApiResponse, AnalysisRequest>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateJobMatchRequest: (req: Request<{}, ApiResponse, JobMatchRequest>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateCustomSuggestionsRequest: (req: Request<{}, ApiResponse, {
    resumeContent: string;
    criteria: string;
    temperature?: number;
    maxTokens?: number;
}>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateChatRequest: (req: Request<{}, ApiResponse, ChatRequest>, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateConversationId: (req: Request<{
    conversationId: string;
}>, res: Response<ApiResponse>, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map