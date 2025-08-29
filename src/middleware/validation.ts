// Validation middleware for API requests

import { Request, Response, NextFunction } from 'express';
import { 
  CreateResumeRequest, 
  ApiResponse, 
  ResumeParams, 
  AnalysisRequest, 
  JobMatchRequest,
  ChatRequest
} from '../types';

export const validateResumeData = (
  req: Request<{}, ApiResponse, CreateResumeRequest>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { name, email, title } = req.body;
  
  // Check required fields
  if (!name || !email || !title) {
    res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, and title are required'
    });
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
    return;
  }
  
  // Validate name length
  if (name.length < 2 || name.length > 100) {
    res.status(400).json({
      success: false,
      error: 'Name must be between 2 and 100 characters'
    });
    return;
  }
  
  // Validate title length
  if (title.length < 2 || title.length > 100) {
    res.status(400).json({
      success: false,
      error: 'Title must be between 2 and 100 characters'
    });
    return;
  }
  
  next();
};

export const validateIdParam = (
  req: Request<ResumeParams>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({
      success: false,
      error: 'Invalid ID parameter'
    });
    return;
  }
  
  next();
};

export const validateAnalysisRequest = (
  req: Request<{}, ApiResponse, AnalysisRequest>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { resumeContent } = req.body;
  
  if (!resumeContent || typeof resumeContent !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Resume content is required and must be a string'
    });
    return;
  }
  
  if (resumeContent.length < 10) {
    res.status(400).json({
      success: false,
      error: 'Resume content is too short for analysis'
    });
    return;
  }
  
  next();
};

export const validateJobMatchRequest = (
  req: Request<{}, ApiResponse, JobMatchRequest>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { resumeContent, jobDescription } = req.body;
  
  if (!resumeContent || !jobDescription) {
    res.status(400).json({
      success: false,
      error: 'Both resume content and job description are required'
    });
    return;
  }
  
  if (typeof resumeContent !== 'string' || typeof jobDescription !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Resume content and job description must be strings'
    });
    return;
  }
  
  if (resumeContent.length < 10 || jobDescription.length < 10) {
    res.status(400).json({
      success: false,
      error: 'Content too short for meaningful analysis'
    });
    return;
  }
  
  next();
};

export const validateCustomSuggestionsRequest = (
  req: Request<{}, ApiResponse, { resumeContent: string; criteria: string; temperature?: number; maxTokens?: number }>,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const { resumeContent, criteria, temperature, maxTokens } = req.body;
  
  if (!resumeContent || !criteria) {
    res.status(400).json({
      success: false,
      error: 'Resume content and criteria are required'
    });
    return;
  }
  
  if (typeof resumeContent !== 'string' || typeof criteria !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Resume content and criteria must be strings'
    });
    return;
  }
  
  if (resumeContent.length < 10 || criteria.length < 5) {
    res.status(400).json({
      success: false,
      error: 'Content too short for meaningful suggestions'
    });
    return;
  }
  
  // Optional validation for AI parameters
  if (temperature !== undefined) {
    if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
      res.status(400).json({
        success: false,
        error: 'Temperature must be a number between 0 and 2'
      });
      return;
    }
  }
  
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
