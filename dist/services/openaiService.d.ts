import { OpenAIResponse, OpenAIPromptConfig, ResumeAnalysisPrompt, ResumeEnhancementPrompt, JobMatchPrompt } from '../types';
export declare class OpenAIService {
    private openai;
    private readonly defaultConfig;
    constructor();
    private isConfigured;
    analyzeResume(prompt: ResumeAnalysisPrompt): Promise<OpenAIResponse>;
    enhanceResume(prompt: ResumeEnhancementPrompt): Promise<OpenAIResponse>;
    matchJobDescription(prompt: JobMatchPrompt): Promise<OpenAIResponse>;
    getCustomSuggestions(resumeContent: string, criteria: string, promptConfig?: Partial<OpenAIPromptConfig>): Promise<OpenAIResponse>;
    private getMockAnalysis;
    private getMockEnhancement;
    private getMockJobMatch;
}
export declare const openaiService: OpenAIService;
//# sourceMappingURL=openaiService.d.ts.map