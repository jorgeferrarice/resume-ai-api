"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resumeController = __importStar(require("../controllers/resumeController"));
const chatController = __importStar(require("../controllers/chatController"));
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/resume', resumeController.getAllResumes);
router.get('/resume/:id', validation_1.validateIdParam, resumeController.getResumeById);
router.post('/resume', validation_1.validateResumeData, resumeController.createResume);
router.put('/resume/:id', validation_1.validateIdParam, resumeController.updateResume);
router.delete('/resume/:id', validation_1.validateIdParam, resumeController.deleteResume);
router.post('/resume/analyze', validation_1.validateAnalysisRequest, resumeController.analyzeResume);
router.post('/resume/enhance', validation_1.validateAnalysisRequest, resumeController.enhanceResume);
router.post('/resume/match-job', validation_1.validateJobMatchRequest, resumeController.matchJobDescription);
router.post('/resume/suggestions', validation_1.validateCustomSuggestionsRequest, resumeController.getCustomSuggestions);
router.post('/chat', validation_1.validateChatRequest, chatController.sendChatMessage);
router.get('/chat/:conversationId', validation_1.validateConversationId, chatController.getConversationHistory);
router.delete('/chat/:conversationId', validation_1.validateConversationId, chatController.deleteConversation);
router.get('/conversations', chatController.getAllConversations);
router.post('/conversations/cleanup', chatController.cleanupOldConversations);
router.get('/', (_req, res) => {
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
exports.default = router;
//# sourceMappingURL=api.js.map