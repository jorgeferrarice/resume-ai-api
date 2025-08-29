import { Response } from 'express';
import { chatService } from '../services/chatService';
import { conversationService } from '../services/conversationService';
import {
  ApiResponse,
  ChatRequest,
  ChatResponse,
  TypedRequest
} from '../types';

/**
 * Send a message to Elevatr AI assistant
 */
export const sendChatMessage = async (
  req: TypedRequest<ChatRequest>,
  res: Response<ApiResponse<ChatResponse>>
): Promise<void> => {
  try {
    const { message, conversationId, temperature, maxTokens } = req.body;
    
    if (!message || message.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
      return;
    }

    const result = await chatService.sendMessage({
      message: message.trim(),
      conversationId,
      temperature,
      maxTokens
    });

    if (!result.success || !result.data) {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send message'
      });
      return;
    }

    res.json({
      success: true,
      data: result.data,
      message: 'Message sent successfully',
      ...(result.usage && { usage: result.usage })
    });

  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message'
    });
  }
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (
  req: TypedRequest<{ conversationId: string }>,
  res: Response<ApiResponse<any>>
): Promise<void> => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
      return;
    }

    const conversation = chatService.getConversationHistory(conversationId);

    if (!conversation) {
      res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
      return;
    }

    res.json({
      success: true,
      data: conversation,
      message: 'Conversation history retrieved'
    });

  } catch (error) {
    console.error('Error in getConversationHistory:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation history'
    });
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (
  req: TypedRequest<{ conversationId: string }>,
  res: Response<ApiResponse<null>>
): Promise<void> => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      res.status(400).json({
        success: false,
        error: 'Conversation ID is required'
      });
      return;
    }

    const deleted = chatService.deleteConversation(conversationId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteConversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation'
    });
  }
};

/**
 * Get all conversations (for admin/debug purposes)
 */
export const getAllConversations = async (
  _req: TypedRequest,
  res: Response<ApiResponse<any[]>>
): Promise<void> => {
  try {
    const conversations = conversationService.getAllConversations().map(conv => ({
      id: conv.id,
      messageCount: conv.messages.length,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      isContextInjected: conv.isContextInjected,
      lastMessage: conv.messages.length > 0 
        ? conv.messages[conv.messages.length - 1]!.content.substring(0, 100) + '...'
        : 'No messages'
    }));

    res.json({
      success: true,
      data: conversations,
      message: `Found ${conversations.length} conversations`
    });

  } catch (error) {
    console.error('Error in getAllConversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversations'
    });
  }
};

/**
 * Clean up old conversations
 */
export const cleanupOldConversations = async (
  req: TypedRequest<{ maxAgeHours?: number }>,
  res: Response<ApiResponse<{ deletedCount: number }>>
): Promise<void> => {
  try {
    const { maxAgeHours = 24 } = req.body;
    
    const deletedCount = conversationService.cleanupOldConversations(maxAgeHours);

    res.json({
      success: true,
      data: { deletedCount },
      message: `Cleaned up ${deletedCount} old conversations`
    });

  } catch (error) {
    console.error('Error in cleanupOldConversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup conversations'
    });
  }
};
