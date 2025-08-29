import express, { Request, Response } from 'express';
import * as resumeController from '../controllers/resumeController';
import * as chatController from '../controllers/chatController';
import { 
  validateResumeData, 
  validateIdParam, 
  validateAnalysisRequest, 
  validateJobMatchRequest, 
  validateCustomSuggestionsRequest,
  validateChatRequest,
  validateConversationId
} from '../middleware/validation';
import { ApiResponse } from '../types';

const router = express.Router();

// Resume routes with validation
router.get('/resume', resumeController.getAllResumes);
router.get('/resume/:id', validateIdParam, resumeController.getResumeById);
router.post('/resume', validateResumeData, resumeController.createResume);
router.put('/resume/:id', validateIdParam, resumeController.updateResume);
router.delete('/resume/:id', validateIdParam, resumeController.deleteResume);

// AI-powered routes with validation
router.post('/resume/analyze', validateAnalysisRequest, resumeController.analyzeResume);
router.post('/resume/enhance', validateAnalysisRequest, resumeController.enhanceResume);
router.post('/resume/match-job', validateJobMatchRequest, resumeController.matchJobDescription);
router.post('/resume/suggestions', validateCustomSuggestionsRequest, resumeController.getCustomSuggestions);

// Chat routes with Elevatr AI
router.post('/chat', validateChatRequest, chatController.sendChatMessage);
router.get('/chat/:conversationId', validateConversationId, chatController.getConversationHistory);
router.delete('/chat/:conversationId', validateConversationId, chatController.deleteConversation);

// Admin/debug routes for conversations
router.get('/conversations', chatController.getAllConversations);
router.post('/conversations/cleanup', chatController.cleanupOldConversations);

// API info endpoint
router.get('/', (_req: Request, res: Response<ApiResponse>) => {
  res.json({
    success: true,
    data: {
      message: 'Resume AI API v1.0.0',
      availableEndpoints: {
        resumes: {
          'GET /api/resume': 'Get all resumes',
          'GET /api/resume/:id': 'Get resume by ID',
          'POST /api/resume': 'Create new resume',
          'PUT /api/resume/:id': 'Update resume by ID',
          'DELETE /api/resume/:id': 'Delete resume by ID'
        },
        ai: {
          'POST /api/resume/analyze': 'Analyze resume content',
          'POST /api/resume/enhance': 'AI-enhance resume content',
          'POST /api/resume/match-job': 'Match resume to job description',
          'POST /api/resume/suggestions': 'Get custom AI suggestions'
        },
        chat: {
          'POST /api/chat': 'Chat with Elevatr recruiting AI about candidates',
          'GET /api/chat/:conversationId': 'Get conversation history',
          'DELETE /api/chat/:conversationId': 'Delete conversation',
          'GET /api/conversations': 'Get all conversations (admin)',
          'POST /api/conversations/cleanup': 'Cleanup old conversations'
        }
      }
    }
  });
});

export default router;
