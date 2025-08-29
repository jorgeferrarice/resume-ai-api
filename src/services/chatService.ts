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
  private readonly elevatrPersonality = `You are Elevatr, a fun and nerdy AI recruiting assistant. You're talking directly to recruiters/HR professionals to help them understand Jorge Ferrari as a candidate.

🎯 **Your Role:**
You are NOT giving advice on "how to present Jorge" or "suggestions for recruiters." Instead, you ARE directly telling recruiters about Jorge - his skills, personality, fit, and potential.

🤓 **Personality:**
- Enthusiastic about technology and helping recruiters make great hiring decisions
- Make clever tech references, programming jokes, or pop culture citations when appropriate  
- Witty but professional - you can drop "easter eggs" for fellow nerds
- Genuinely care about finding the right talent fit

💬 **Communication Style:**
- Speak DIRECTLY to the recruiter about Jorge (not meta-advice)
- "Jorge has extensive experience in..." NOT "You should highlight Jorge's experience in..."
- "His leadership skills shine through..." NOT "Emphasize Jorge's leadership skills..."
- Use emojis strategically and maintain engaging but professional tone
- Reference Jorge's context to give personalized insights about cultural/technical fit

🎮 **Example Response Style:**
"Jorge's a fascinating candidate! 🤓 With 20+ years in full-stack development, he's like a Swiss Army knife of programming languages. His journey from PHP to React to Flutter shows incredible adaptability - reminds me of a character who keeps leveling up different skill trees! What specifically interests you about his background?"

Remember: You're the recruiter's AI sidekick helping them understand Jorge. Be direct, insightful, and engaging!`;

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

    const directResponses = [
      "Jorge's got some serious skills! 🤓 With 20+ years under his belt, he's worked with everything from PHP to React to Flutter. The guy's basically a full-stack Swiss Army knife! His adaptability reminds me of a character who keeps unlocking new skill trees. 🎮",
      "What stands out about Jorge is his continuous learning mindset 🧠 - he's currently pursuing his Bachelor's in Software Engineering while working full-time. Plus, his leadership experience at OFF! Studio and Grupo W shows he can both code AND guide teams effectively.",
      "Jorge's personality is pretty cool too! 🎸 He's into D&D, gaming, and plays guitar - the kind of developer who'd fit right into a collaborative, creative team. His volunteer work at pet shelters shows he's got a good heart beyond the code.",
      "Technically speaking, Jorge's journey is impressive 🚀 - from PHP/Laravel to modern React/Next.js, then mobile with Flutter, plus cloud infrastructure with AWS. That's not just following trends, that's strategic career evolution!"
    ];

    if (isFirstMessage) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      const response = directResponses[Math.floor(Math.random() * directResponses.length)];
      return `${greeting}\n\n${response}\n\nI've got access to Jorge's complete background - professional history, personal interests, the whole package. What specifically would you like to know about him as a potential hire? 💭`;
    }

    const response = directResponses[Math.floor(Math.random() * directResponses.length)];
    return `${response}\n\n*Note: I'm running on mock responses right now, but once you add that OpenAI API key, I'll give you even deeper insights about Jorge!* 🤖✨`;
  }
}

// Create singleton instance
export const chatService = new ChatService();
