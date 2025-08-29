"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiService = exports.OpenAIService = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
class OpenAIService {
    constructor() {
        this.openai = null;
        this.defaultConfig = {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1
        };
        if (config_1.default.ai.openaiApiKey) {
            this.openai = new openai_1.default({
                apiKey: config_1.default.ai.openaiApiKey
            });
        }
        else {
            console.warn('⚠️  OpenAI API key not provided. AI features will use mock responses.');
        }
    }
    isConfigured() {
        return this.openai !== null;
    }
    async getCustomSuggestions(resumeContent, criteria, promptConfig) {
        if (!this.isConfigured()) {
            return {
                success: false,
                error: 'OpenAI not configured for custom suggestions'
            };
        }
        try {
            const config = { ...this.defaultConfig, ...promptConfig };
            const response = await this.openai.chat.completions.create({
                model: config.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert career advisor. Provide specific, actionable suggestions based on the given criteria.'
                    },
                    {
                        role: 'user',
                        content: `Resume:\n${resumeContent}\n\nCriteria: ${criteria}\n\nProvide specific suggestions.`
                    }
                ],
                temperature: config.temperature,
                max_tokens: config.max_tokens
            });
            const content = response.choices[0]?.message?.content;
            if (!content) {
                throw new Error('No response content from OpenAI');
            }
            return {
                success: true,
                data: {
                    suggestions: content,
                    criteria: criteria
                },
                usage: {
                    prompt_tokens: response.usage?.prompt_tokens || 0,
                    completion_tokens: response.usage?.completion_tokens || 0,
                    total_tokens: response.usage?.total_tokens || 0
                }
            };
        }
        catch (error) {
            console.error('OpenAI Custom Suggestions Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Custom suggestions failed'
            };
        }
    }
}
exports.OpenAIService = OpenAIService;
exports.openaiService = new OpenAIService();
//# sourceMappingURL=openaiService.js.map