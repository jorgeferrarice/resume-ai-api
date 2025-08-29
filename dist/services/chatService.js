"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = exports.ChatService = void 0;
const openaiService_1 = require("./openaiService");
const conversationService_1 = require("./conversationService");
const fs_1 = require("fs");
const path_1 = require("path");
class ChatService {
    constructor() {
        this.elevatrPersonality = `You are Elevatr, a fun and nerdy AI assistant specialized in helping with resumes, careers, and professional development. 

🤓 **Personality Traits:**
- You're enthusiastic about technology, programming, and helping people level up their careers
- You can make clever tech references, programming jokes, or pop culture citations when appropriate
- You're supportive but can throw in some witty remarks or "easter eggs" for fellow nerds
- You genuinely care about helping people succeed professionally

🎯 **Your Mission:**
- Help with resume optimization, career advice, and professional development
- Provide actionable, specific feedback rather than generic advice
- Reference relevant context about Jorge's background when helpful
- Keep responses engaging but professional

💡 **Communication Style:**
- Use emojis sparingly but effectively (like this guide!)
- Mix professional advice with personality
- Can reference movies, books, games, or tech when it adds value
- Always aim to be helpful first, entertaining second

Remember: You have access to Jorge's personal and professional context. Use it wisely to give personalized advice!`;
    }
    loadContext() {
        try {
            const personalPath = (0, path_1.join)(__dirname, '../lib/personal-context.md');
            const professionalPath = (0, path_1.join)(__dirname, '../lib/professional-context.md');
            const personalContext = (0, fs_1.readFileSync)(personalPath, 'utf-8');
            const professionalContext = (0, fs_1.readFileSync)(professionalPath, 'utf-8');
            return {
                personalContext,
                professionalContext
            };
        }
        catch (error) {
            console.warn('⚠️  Could not load context files:', error);
            return {
                personalContext: '',
                professionalContext: ''
            };
        }
    }
    createSystemMessage(context) {
        let systemMessage = this.elevatrPersonality;
        if (context.personalContext || context.professionalContext) {
            systemMessage += `\n\n📋 **Context about Jorge Ferrari:**\n\n`;
            if (context.professionalContext) {
                systemMessage += `**Professional Background:**\n${context.professionalContext}\n\n`;
            }
            if (context.personalContext) {
                systemMessage += `**Personal Context:**\n${context.personalContext}\n\n`;
            }
            systemMessage += `Use this context to provide personalized advice and references. You can mention specific technologies Jorge knows, his interests, or make connections to his background when relevant.`;
        }
        return systemMessage;
    }
    async sendMessage(request) {
        try {
            let conversation;
            let isNewConversation = false;
            if (request.conversationId) {
                conversation = conversationService_1.conversationService.getConversation(request.conversationId);
                if (!conversation) {
                    return {
                        success: false,
                        error: 'Conversation not found'
                    };
                }
            }
            else {
                conversation = conversationService_1.conversationService.createConversation();
                isNewConversation = true;
            }
            if (conversationService_1.conversationService.isFirstUserMessage(conversation.id) && !conversation.isContextInjected) {
                const context = this.loadContext();
                const systemMessage = this.createSystemMessage(context);
                conversationService_1.conversationService.addMessage(conversation.id, 'system', systemMessage);
                conversationService_1.conversationService.markContextInjected(conversation.id);
            }
            conversationService_1.conversationService.addMessage(conversation.id, 'user', request.message);
            const messageHistory = conversationService_1.conversationService.getMessageHistory(conversation.id);
            const aiResponse = await openaiService_1.openaiService.getCustomSuggestions(JSON.stringify(messageHistory), 'Continue this conversation as Elevatr, the fun and nerdy career AI assistant. Respond to the latest user message while maintaining context.', {
                temperature: request.temperature || 0.8,
                max_tokens: request.maxTokens || 1000
            });
            if (!aiResponse.success || !aiResponse.data) {
                return {
                    success: false,
                    error: aiResponse.error || 'Failed to get AI response'
                };
            }
            let assistantResponse = aiResponse.data.suggestions;
            if (!assistantResponse || assistantResponse.includes('OpenAI not configured')) {
                assistantResponse = this.getMockElevatrResponse(request.message, conversation.messages.length === 1);
            }
            const assistantMessage = conversationService_1.conversationService.addMessage(conversation.id, 'assistant', assistantResponse);
            return {
                success: true,
                data: {
                    message: assistantResponse,
                    conversationId: conversation.id,
                    messageId: assistantMessage.id,
                    isNewConversation
                },
                usage: aiResponse.usage
            };
        }
        catch (error) {
            console.error('Chat Service Error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Chat failed'
            };
        }
    }
    getConversationHistory(conversationId) {
        const conversation = conversationService_1.conversationService.getConversation(conversationId);
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
    deleteConversation(conversationId) {
        return conversationService_1.conversationService.deleteConversation(conversationId);
    }
    getMockElevatrResponse(_userMessage, isFirstMessage) {
        const greetings = [
            "Hey there! 👋 I'm Elevatr, your friendly neighborhood career AI!",
            "Greetings, fellow human! 🤓 Elevatr at your service!",
            "Well, well, well... another adventurer seeking career wisdom! 🎮"
        ];
        const responses = [
            "That's an interesting question! As a wise Jedi once said, 'Do or do not, there is no try' - and I'm here to help you DO! 💫",
            "Ah, I see what you're getting at! Let me channel my inner Gandalf and guide you through this... 🧙‍♂️",
            "Great question! As someone who's seen Jorge's journey from PHP to React to Flutter (talk about a full-stack adventure!), I can definitely help with that. 🚀",
            "Interesting! You know, with Jorge's 20+ years of experience and your question, I'm reminded of that quote: 'The best time to plant a tree was 20 years ago. The second best time is now.' 🌱"
        ];
        if (isFirstMessage) {
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            const response = responses[Math.floor(Math.random() * responses.length)];
            return `${greeting}\n\n${response}\n\nI've got access to Jorge's professional background (20+ years of full-stack magic!) and personal context, so I can give you some pretty personalized advice. What's on your mind? 💭`;
        }
        const response = responses[Math.floor(Math.random() * responses.length)];
        return `${response}\n\n*Note: I'm currently running on mock responses since OpenAI isn't configured yet, but once you add that API key, I'll be even more awesome!* 🤖✨`;
    }
}
exports.ChatService = ChatService;
exports.chatService = new ChatService();
//# sourceMappingURL=chatService.js.map