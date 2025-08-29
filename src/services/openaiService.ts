import OpenAI from 'openai';
import config from '../config';
import {
  OpenAIResponse,
  OpenAIPromptConfig,
  ResumeAnalysisPrompt,
  ResumeEnhancementPrompt,
  JobMatchPrompt
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
   * Analyze resume content and provide insights
   */
  async analyzeResume(prompt: ResumeAnalysisPrompt): Promise<OpenAIResponse> {
    if (!this.isConfigured()) {
      return this.getMockAnalysis();
    }

    try {
      const systemPrompt = `You are an expert resume analyst and career coach. Analyze the provided resume and return a JSON response with the following structure:
{
  "score": number (0-100),
  "strengths": array of strings (top 3-5 strengths),
  "improvements": array of strings (3-5 specific improvement suggestions),
  "keywords": array of strings (important keywords found or missing),
  "atsCompatibility": number (0-100, how well it works with ATS systems)
}

Focus on:
- Professional presentation and formatting
- Quantifiable achievements
- Relevant skills and experience
- ATS optimization
- Industry-specific keywords
${prompt.industryFocus ? `- Industry focus: ${prompt.industryFocus}` : ''}`;

      const response = await this.openai!.chat.completions.create({
        model: this.defaultConfig.model!,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please analyze this resume:\n\n${prompt.resumeContent}`
          }
        ],
        temperature: this.defaultConfig.temperature,
        max_tokens: this.defaultConfig.max_tokens,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      const analysisData = JSON.parse(content);
      
      return {
        success: true,
        data: analysisData,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      console.error('OpenAI Analysis Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      };
    }
  }

  /**
   * Enhance resume content with AI suggestions
   */
  async enhanceResume(prompt: ResumeEnhancementPrompt): Promise<OpenAIResponse> {
    if (!this.isConfigured()) {
      return this.getMockEnhancement(prompt);
    }

    try {
      const tone = prompt.tone || 'professional';
      const systemPrompt = `You are an expert resume writer and career coach. Enhance the provided resume content and return a JSON response with this structure:
{
  "enhancedContent": "improved version of the resume",
  "improvements": array of strings (specific improvements made),
  "summary": "brief summary of changes made"
}

Enhancement guidelines:
- Use strong action verbs
- Add quantifiable achievements where possible
- Improve formatting and structure
- Optimize for ATS systems
- Maintain ${tone} tone
- ${prompt.targetRole ? `Optimize for target role: ${prompt.targetRole}` : 'General professional enhancement'}
- Keep the original meaning but make it more impactful`;

      const response = await this.openai!.chat.completions.create({
        model: this.defaultConfig.model!,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Please enhance this resume:\n\n${prompt.resumeContent}`
          }
        ],
        temperature: this.defaultConfig.temperature,
        max_tokens: 1500, // More tokens for enhancement
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      const enhancementData = JSON.parse(content);
      
      return {
        success: true,
        data: {
          originalContent: prompt.resumeContent,
          enhancedContent: enhancementData.enhancedContent,
          improvements: enhancementData.improvements,
          targetRole: prompt.targetRole || 'General position',
          summary: enhancementData.summary
        },
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      console.error('OpenAI Enhancement Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Enhancement failed'
      };
    }
  }

  /**
   * Match resume against job description
   */
  async matchJobDescription(prompt: JobMatchPrompt): Promise<OpenAIResponse> {
    if (!this.isConfigured()) {
      return this.getMockJobMatch();
    }

    try {
      const systemPrompt = `You are an expert career counselor and recruiter. Compare the resume against the job description and return a JSON response with this structure:
{
  "overallMatch": number (0-100),
  "skillsMatch": {
    "matched": array of matching skills,
    "missing": array of missing important skills
  },
  "recommendations": array of strings (specific actions to improve match),
  "keywordAlignment": number (0-100),
  "strengthsForRole": array of strings (resume strengths relevant to this role),
  "gapsToAddress": array of strings (important gaps to fill)
}

Analysis focus:
- Technical skills alignment
- Experience relevance
- Keyword matching
- Cultural fit indicators
- Career progression alignment`;

      const response = await this.openai!.chat.completions.create({
        model: this.defaultConfig.model!,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Resume:\n${prompt.resumeContent}\n\nJob Description:\n${prompt.jobDescription}\n\nPlease analyze the match between this resume and job description.`
          }
        ],
        temperature: this.defaultConfig.temperature,
        max_tokens: 1200,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      const matchData = JSON.parse(content);
      
      return {
        success: true,
        data: matchData,
        usage: {
          prompt_tokens: response.usage?.prompt_tokens || 0,
          completion_tokens: response.usage?.completion_tokens || 0,
          total_tokens: response.usage?.total_tokens || 0
        }
      };

    } catch (error) {
      console.error('OpenAI Job Match Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Job matching failed'
      };
    }
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

  // Mock responses for when OpenAI is not configured
  private getMockAnalysis(): OpenAIResponse {
    return {
      success: true,
      data: {
        score: Math.floor(Math.random() * 40) + 60,
        strengths: [
          'Clear professional summary',
          'Relevant technical skills listed',
          'Good work experience progression',
          'Education credentials present'
        ],
        improvements: [
          'Add more quantifiable achievements (e.g., "Increased efficiency by 25%")',
          'Include relevant industry certifications',
          'Improve keyword optimization for ATS systems',
          'Add more specific technical accomplishments'
        ],
        keywords: ['JavaScript', 'React', 'Node.js', 'teamwork', 'problem-solving', 'leadership'],
        atsCompatibility: Math.floor(Math.random() * 30) + 70
      }
    };
  }

  private getMockEnhancement(prompt: ResumeEnhancementPrompt): OpenAIResponse {
    return {
      success: true,
      data: {
        originalContent: prompt.resumeContent,
        enhancedContent: `${prompt.resumeContent}\n\n[MOCK ENHANCEMENT: Content has been enhanced with stronger action verbs, quantified achievements, and improved formatting for ATS optimization.]`,
        improvements: [
          'Enhanced action verbs usage (e.g., "led" instead of "was responsible for")',
          'Added quantifiable achievements where possible',
          'Improved formatting for better readability',
          'Optimized keywords for target role',
          'Strengthened professional summary'
        ],
        targetRole: prompt.targetRole || 'General position',
        summary: 'Improved overall impact and ATS compatibility while maintaining professional tone'
      }
    };
  }

  private getMockJobMatch(): OpenAIResponse {
    return {
      success: true,
      data: {
        overallMatch: Math.floor(Math.random() * 40) + 60,
        skillsMatch: {
          matched: ['JavaScript', 'React', 'Node.js', 'Problem Solving', 'Team Collaboration'],
          missing: ['Python', 'AWS', 'Docker', 'Kubernetes', 'GraphQL']
        },
        recommendations: [
          'Highlight your React and Node.js experience more prominently',
          'Consider learning Python and AWS for better role alignment',
          'Emphasize leadership and teamwork experiences',
          'Add specific examples of problem-solving achievements',
          'Include any cloud platform experience you may have'
        ],
        keywordAlignment: Math.floor(Math.random() * 30) + 70,
        strengthsForRole: [
          'Strong technical foundation in required technologies',
          'Demonstrated problem-solving abilities',
          'Team collaboration experience'
        ],
        gapsToAddress: [
          'Cloud platform experience (AWS, Azure)',
          'Container orchestration knowledge',
          'Advanced database management skills'
        ]
      }
    };
  }
}

// Create singleton instance
export const openaiService = new OpenAIService();
