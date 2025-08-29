import { Request, Response } from 'express';
export interface Experience {
    company: string;
    position: string;
    duration: string;
    description: string;
}
export interface Education {
    institution: string;
    degree: string;
    year: string;
}
export interface Resume {
    id: number;
    name: string;
    email: string;
    title: string;
    summary?: string;
    experience?: Experience[];
    skills?: string[];
    education?: Education[];
    createdAt: string;
    updatedAt: string;
}
export interface CreateResumeRequest {
    name: string;
    email: string;
    title: string;
    summary?: string;
    experience?: Experience[];
    skills?: string[];
    education?: Education[];
}
export interface UpdateResumeRequest extends Partial<CreateResumeRequest> {
}
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
export interface ResumeAnalysis {
    score: number;
    strengths: string[];
    improvements: string[];
    keywords: string[];
    atsCompatibility: number;
}
export interface SkillsMatch {
    matched: string[];
    missing: string[];
}
export interface JobMatchAnalysis {
    overallMatch: number;
    skillsMatch: SkillsMatch;
    recommendations: string[];
    keywordAlignment: number;
}
export interface ResumeEnhancement {
    originalContent: string;
    enhancedContent: string;
    improvements: string[];
    targetRole?: string;
}
export interface AnalysisRequest {
    resumeContent: string;
}
export interface EnhancementRequest {
    resumeContent: string;
    targetRole?: string;
}
export interface JobMatchRequest {
    resumeContent: string;
    jobDescription: string;
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
export interface ResumeAnalysisPrompt {
    resumeContent: string;
    includeKeywords?: boolean;
    industryFocus?: string;
}
export interface ResumeEnhancementPrompt {
    resumeContent: string;
    targetRole?: string;
    improvements?: string[];
    tone?: 'professional' | 'casual' | 'technical';
}
export interface JobMatchPrompt {
    resumeContent: string;
    jobDescription: string;
    focusAreas?: string[];
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
export interface ResumeQueryParams {
    page?: string;
    limit?: string;
    search?: string;
}
export interface ResumeParams {
    id: string;
}
//# sourceMappingURL=index.d.ts.map