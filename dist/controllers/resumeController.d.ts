import { Request, Response } from 'express';
import { Resume, CreateResumeRequest, UpdateResumeRequest, ApiResponse, PaginatedResponse, ResumeAnalysis, ResumeEnhancement, JobMatchAnalysis, TypedRequest, ResumeQueryParams, ResumeParams, AnalysisRequest, EnhancementRequest, JobMatchRequest } from '../types';
export declare const getAllResumes: (req: Request<{}, PaginatedResponse<Resume>, {}, ResumeQueryParams>, res: Response<PaginatedResponse<Resume>>) => Promise<void>;
export declare const getResumeById: (req: Request<ResumeParams>, res: Response<ApiResponse<Resume>>) => Promise<void>;
export declare const createResume: (req: TypedRequest<CreateResumeRequest>, res: Response<ApiResponse<Resume>>) => Promise<void>;
export declare const updateResume: (req: Request<ResumeParams, ApiResponse<Resume>, UpdateResumeRequest>, res: Response<ApiResponse<Resume>>) => Promise<void>;
export declare const deleteResume: (req: Request<ResumeParams>, res: Response<ApiResponse<null>>) => Promise<void>;
export declare const analyzeResume: (req: TypedRequest<AnalysisRequest & {
    industryFocus?: string;
    includeKeywords?: boolean;
}>, res: Response<ApiResponse<ResumeAnalysis>>) => Promise<void>;
export declare const enhanceResume: (req: TypedRequest<EnhancementRequest & {
    tone?: "professional" | "casual" | "technical";
    improvements?: string[];
}>, res: Response<ApiResponse<ResumeEnhancement>>) => Promise<void>;
export declare const matchJobDescription: (req: TypedRequest<JobMatchRequest & {
    focusAreas?: string[];
}>, res: Response<ApiResponse<JobMatchAnalysis>>) => Promise<void>;
export declare const getCustomSuggestions: (req: TypedRequest<{
    resumeContent: string;
    criteria: string;
    temperature?: number;
    maxTokens?: number;
}>, res: Response<ApiResponse<{
    suggestions: string;
    criteria: string;
}>>) => Promise<void>;
//# sourceMappingURL=resumeController.d.ts.map