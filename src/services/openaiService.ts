import OpenAI from 'openai';
import config from '../config';
import {
  OpenAIPromptConfig,
  OpenAIResponse
} from '../types';

export class OpenAIService {
  private openai: OpenAI | null = null;
  
  private readonly defaultConfig: OpenAIPromptConfig = {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1
  };

  constructor() {
    if (config.ai.openaiApiKey) {
      this.openai = new OpenAI({
        apiKey: config.ai.openaiApiKey
      });
    } else {
      console.warn('⚠️  OpenAI API key not provided. AI features will use mock responses.');
    }
  }

  private isConfigured(): boolean {
    return this.openai !== null;
  }

  
  /**
   * Generate custom resume suggestions based on specific criteria
   */
  async getCustomSuggestions(
    resumeContent: string, 
    criteria: string, 
    promptConfig?: Partial<OpenAIPromptConfig>
  ): Promise<OpenAIResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI not configured for custom suggestions'
      };
    }

    try {
      const config = { ...this.defaultConfig, ...promptConfig };
      
      const response = await this.openai!.chat.completions.create({
        model: config.model!,
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

    } catch (error) {
      console.error('OpenAI Custom Suggestions Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Custom suggestions failed'
      };
    }
  }

  /**
   * Generic chat completion method using provided messages
   */
  async getChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    promptConfig?: Partial<OpenAIPromptConfig>
  ): Promise<OpenAIResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'OpenAI not configured for chat'
      };
    }

    try {
      const config = { ...this.defaultConfig, ...promptConfig };

      const response = await this.openai!.chat.completions.create({
        model: config.model!,
        messages,
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
          suggestions: content
        },
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      console.error('OpenAI Chat Completion Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chat completion failed'
      };
    }
  }
}

// Create singleton instance
export const openaiService = new OpenAIService();
