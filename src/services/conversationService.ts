import { ChatMessage, Conversation } from '../types';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage for conversations (replace with database in production)
const conversations: Map<string, Conversation> = new Map();

export class ConversationService {
  
  /**
   * Create a new conversation
   */
  createConversation(): Conversation {
    const conversationId = uuidv4();
    const conversation: Conversation = {
      id: conversationId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isContextInjected: false
    };
    
    conversations.set(conversationId, conversation);
    return conversation;
  }

  /**
   * Get conversation by ID
   */
  getConversation(conversationId: string): Conversation | null {
    return conversations.get(conversationId) || null;
  }

  /**
   * Add message to conversation
   */
  addMessage(conversationId: string, role: 'user' | 'assistant' | 'system', content: string): ChatMessage {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const message: ChatMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      conversationId
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    
    return message;
  }

  /**
   * Mark conversation as having context injected
   */
  markContextInjected(conversationId: string): void {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.isContextInjected = true;
    }
  }

  /**
   * Get conversation history for OpenAI format
   */
  getMessageHistory(conversationId: string, includeSystem: boolean = true): Array<{role: string; content: string}> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return [];
    }

    return conversation.messages
      .filter(msg => includeSystem || msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  }

  /**
   * Check if this is the first user message in the conversation
   */
  isFirstUserMessage(conversationId: string): boolean {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      return true;
    }

    const userMessages = conversation.messages.filter(msg => msg.role === 'user');
    return userMessages.length === 0;
  }

  /**
   * Get all conversations (for admin/debug purposes)
   */
  getAllConversations(): Conversation[] {
    return Array.from(conversations.values());
  }

  /**
   * Delete conversation
   */
  deleteConversation(conversationId: string): boolean {
    return conversations.delete(conversationId);
  }

  /**
   * Clean up old conversations (older than 24 hours by default)
   */
  cleanupOldConversations(maxAgeHours: number = 24): number {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    let deletedCount = 0;

    for (const [id, conversation] of conversations.entries()) {
      if (conversation.updatedAt < cutoffTime) {
        conversations.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

// Create singleton instance
export const conversationService = new ConversationService();
