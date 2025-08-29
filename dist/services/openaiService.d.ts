import { OpenAIPromptConfig, OpenAIResponse } from '../types';
export declare class OpenAIService {
    private openai;
    private readonly defaultConfig;
    constructor();
    private isConfigured;
    getCustomSuggestions(resumeContent: string, criteria: string, promptConfig?: Partial<OpenAIPromptConfig>): Promise<OpenAIResponse>;
    getChatCompletion(messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>, promptConfig?: Partial<OpenAIPromptConfig>): Promise<OpenAIResponse>;
}
export declare const openaiService: OpenAIService;
//# sourceMappingURL=openaiService.d.ts.map