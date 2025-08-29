import express, { Request, Response } from 'express';
import * as chatController from '../controllers/chatController';
import { 
  validateChatRequest,
  validateConversationId
} from '../middleware/validation';
import { ApiResponse } from '../types';

const router = express.Router();

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
      message: 'Resume AI API v1.0.0'
    }
  });
});

export default router;
