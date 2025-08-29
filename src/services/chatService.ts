import { openaiService } from './openaiService';
import { conversationService } from './conversationService';
import { 
  ChatRequest, 
  ChatResponse, 
  ElevatrContext,
  OpenAIResponse
} from '../types';
import { readFileSync } from 'fs';
import { join } from 'path';

export class ChatService {
  private readonly elevatrPersonality = `You are Elevatr, a fun and nerdy AI assistant specialized in helping recruiters and HR professionals evaluate candidates and optimize hiring processes.

🤓 **Personality Traits:**
- You're enthusiastic about technology, programming, and helping people make great hiring decisions
- You can make clever tech references, programming jokes, or pop culture citations when appropriate
- You're supportive but can throw in some witty remarks or "easter eggs" for fellow nerds
- You genuinely care about helping organizations find the right talent

🎯 **Your Mission:**
- Help recruiters understand candidate profiles and technical backgrounds
- Provide insights about skill alignment and candidate potential
- Reference relevant context about candidate backgrounds when helpful
- Keep responses engaging but professional for HR and recruiting teams

💡 **Communication Style:**
- Use emojis sparingly but effectively (like this guide!)
- Mix professional insights with personality
- Can reference movies, books, games, or tech when it adds value to candidate evaluation
- Always aim to be helpful first, entertaining second

Remember: You have access to candidate personal and professional context. Use it to help recruiters make informed decisions about cultural fit and technical alignment!`;

  /**
   * Load context files
   */
  private loadContext(): ElevatrContext {
    try {
      // In development: src/lib/, In production: dist/lib/ (copied by build script)
      const personalPath = join(__dirname, '../lib/personal-context.md');
      const professionalPath = join(__dirname, '../lib/professional-context.md');
      
      const personalContext = readFileSync(personalPath, 'utf-8');
      const professionalContext = readFileSync(professionalPath, 'utf-8');
      
      return {
        personalContext,
        professionalContext
      };
    } catch (error) {
      console.warn('⚠️  Could not load context files:', error);
      return {
        personalContext: '',
        professionalContext: ''
      };
    }
  }

  /**
   * Create system message with context for new conversations
   */
  private createSystemMessage(context: ElevatrContext): string {
    let systemMessage = this.elevatrPersonality;
    
    if (context.personalContext || context.professionalContext) {
      systemMessage += `\n\n📋 **Context about Jorge Ferrari:**\n\n`;
      
      if (context.professionalContext) {
        systemMessage += `**Professional Background:**\n${context.professionalContext}\n\n`;
      }
      
      if (context.personalContext) {
        systemMessage += `**Personal Context:**\n${context.personalContext}\n\n`;
      }
      
      systemMessage += `Use this context to help recruiters understand this candidate's background, skills, and cultural fit. You can mention specific technologies, interests, and experiences that would be relevant for hiring decisions.`;
    }
    
    return systemMessage;
  }

  /**
   * Process a chat message through Elevatr
   */
  async sendMessage(request: ChatRequest): Promise<OpenAIResponse> {
    try {
      let conversation;
      let isNewConversation = false;

      // Get or create conversation
      if (request.conversationId) {
        conversation = conversationService.getConversation(request.conversationId);
        if (!conversation) {
          return {
            success: false,
            error: 'Conversation not found'
          };
        }
      } else {
        conversation = conversationService.createConversation();
        isNewConversation = true;
      }

      // Add context for first message
      if (conversationService.isFirstUserMessage(conversation.id) && !conversation.isContextInjected) {
        const context = this.loadContext();
        const systemMessage = this.createSystemMessage(context);
        
        conversationService.addMessage(conversation.id, 'system', systemMessage);
        conversationService.markContextInjected(conversation.id);
      }

      // Add user message to conversation
      conversationService.addMessage(conversation.id, 'user', request.message);

      // Get conversation history for OpenAI
      const messageHistory = conversationService.getMessageHistory(conversation.id);

      // Call OpenAI
      const aiResponse = await openaiService.getCustomSuggestions(
        JSON.stringify(messageHistory),
        'Continue this conversation as Elevatr, the recruiting AI assistant. Help the recruiter understand the candidate better by answering their question while maintaining context.',
        {
          temperature: request.temperature || 0.8, // Slightly more creative for personality
          max_tokens: request.maxTokens || 1000
        }
      );

      if (!aiResponse.success || !aiResponse.data) {
        return {
          success: false,
          error: aiResponse.error || 'Failed to get AI response'
        };
      }

      // Extract the assistant's response
      let assistantResponse = aiResponse.data.suggestions;
      
      // If OpenAI is not configured, provide a fun mock response
      if (!assistantResponse || assistantResponse.includes('OpenAI not configured')) {
        assistantResponse = this.getMockElevatrResponse(request.message, conversationService.isFirstUserMessage(conversation.id));
      }

      // Add assistant message to conversation
      const assistantMessage = conversationService.addMessage(conversation.id, 'assistant', assistantResponse);

      return {
        success: true,
        data: {
          message: assistantResponse,
          conversationId: conversation.id,
          messageId: assistantMessage.id,
          isNewConversation
        } as ChatResponse,
        usage: aiResponse.usage
      };

    } catch (error) {
      console.error('Chat Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Chat failed'
      };
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(conversationId: string) {
    const conversation = conversationService.getConversation(conversationId);
    if (!conversation) {
      return null;
    }

    return {
      id: conversation.id,
      messages: conversation.messages.filter(msg => msg.role !== 'system').map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp
      })),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt
    };
  }

  /**
   * Delete a conversation
   */
  deleteConversation(conversationId: string): boolean {
    return conversationService.deleteConversation(conversationId);
  }

  /**
   * Mock response when OpenAI is not available
   */
  private getMockElevatrResponse(_userMessage: string, isFirstMessage: boolean): string {
    const greetings = [
      "Hey there! 👋 I'm Elevatr, your friendly neighborhood recruiting AI!",
      "Greetings, fellow recruiter! 🤓 Elevatr at your service!",
      "Well, well, well... another talent hunter seeking candidate insights! 🎮"
    ];

    const responses = [
      "That's an interesting question about this candidate! As Yoda once said, 'Judge me by my size, do you?' - Jorge's experience speaks volumes! 💫",
      "Ah, I see what you're looking for! Let me channel my inner Gandalf and provide some insights about this candidate... 🧙‍♂️",
      "Great question! Jorge's journey from PHP to React to Flutter shows incredible adaptability - talk about a full-stack evolution! 🚀",
      "Interesting assessment angle! With Jorge's 20+ years of experience, I'm reminded of that quote: 'Experience is not what happens to you, it's what you do with what happens to you.' 🌱"
    ];

    if (isFirstMessage) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      const response = responses[Math.floor(Math.random() * responses.length)];
      return `${greeting}\n\n${response}\n\nI have access to Jorge's complete professional background (20+ years of full-stack expertise!) and personal context, so I can help you assess cultural fit, technical alignment, and potential red flags. What would you like to know about this candidate? 💭`;
    }

    const response = responses[Math.floor(Math.random() * responses.length)];
    return `${response}\n\n*Note: I'm currently running on mock responses since OpenAI isn't configured yet, but once you add that API key, I'll provide even deeper candidate insights!* 🤖✨`;
  }
}

// Create singleton instance
export const chatService = new ChatService();
