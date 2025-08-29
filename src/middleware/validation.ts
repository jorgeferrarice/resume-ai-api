// Validation middleware for API requests

import { Request, Response, NextFunction } from 'express';
import { 
  ApiResponse,
  ChatRequest
} from '../types';

export const validateChatRequest = (
  req: Request<{}, ApiResponse, ChatRequest>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { message, conversationId, temperature, maxTokens } = req.body;
  
  if (!message || typeof message !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Message is required and must be a string'
    });
    return;
  }
  
  if (message.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Message cannot be empty'
    });
    return;
  }
  
  if (message.length > 4000) {
    res.status(400).json({
      success: false,
      error: 'Message is too long (maximum 4000 characters)'
    });
    return;
  }
  
  // Optional conversation ID validation
  if (conversationId !== undefined) {
    if (typeof conversationId !== 'string' || conversationId.trim().length === 0) {
      res.status(400).json({
        success: false,
        error: 'Conversation ID must be a valid string'
      });
      return;
    }
  }
  
  // Optional temperature validation
  if (temperature !== undefined) {
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
      res.status(400).json({
        success: false,
        error: 'Temperature must be a number between 0 and 2'
      });
      return;
    }
  }
  
  // Optional max tokens validation
  if (maxTokens !== undefined) {
    if (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 4000) {
      res.status(400).json({
        success: false,
        error: 'Max tokens must be a number between 1 and 4000'
      });
      return;
    }
  }
  
  next();
};

export const validateConversationId = (
  req: Request<{ conversationId: string }>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { conversationId } = req.params;
  
  if (!conversationId || typeof conversationId !== 'string' || conversationId.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: 'Valid conversation ID is required'
    });
    return;
  }
  
  next();
};
