"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupOldConversations = exports.getAllConversations = exports.deleteConversation = exports.getConversationHistory = exports.sendChatMessage = void 0;
const chatService_1 = require("../services/chatService");
const conversationService_1 = require("../services/conversationService");
const sendChatMessage = async (req, res) => {
    try {
        const { message, conversationId, temperature, maxTokens } = req.body;
        if (!message || message.trim().length === 0) {
            res.status(400).json({
                success: false,
                error: 'Message content is required'
            });
            return;
        }
        const result = await chatService_1.chatService.sendMessage({
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
    }
    catch (error) {
        console.error('Error in sendChatMessage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process chat message'
        });
    }
};
exports.sendChatMessage = sendChatMessage;
const getConversationHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            res.status(400).json({
                success: false,
                error: 'Conversation ID is required'
            });
            return;
        }
        const conversation = chatService_1.chatService.getConversationHistory(conversationId);
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
    }
    catch (error) {
        console.error('Error in getConversationHistory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve conversation history'
        });
    }
};
exports.getConversationHistory = getConversationHistory;
const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            res.status(400).json({
                success: false,
                error: 'Conversation ID is required'
            });
            return;
        }
        const deleted = chatService_1.chatService.deleteConversation(conversationId);
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
    }
    catch (error) {
        console.error('Error in deleteConversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation'
        });
    }
};
exports.deleteConversation = deleteConversation;
const getAllConversations = async (_req, res) => {
    try {
        const conversations = conversationService_1.conversationService.getAllConversations().map(conv => ({
            id: conv.id,
            messageCount: conv.messages.length,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            isContextInjected: conv.isContextInjected,
            lastMessage: conv.messages.length > 0
                ? conv.messages[conv.messages.length - 1].content.substring(0, 100) + '...'
                : 'No messages'
        }));
        res.json({
            success: true,
            data: conversations,
            message: `Found ${conversations.length} conversations`
        });
    }
    catch (error) {
        console.error('Error in getAllConversations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve conversations'
        });
    }
};
exports.getAllConversations = getAllConversations;
const cleanupOldConversations = async (req, res) => {
    try {
        const { maxAgeHours = 24 } = req.body;
        const deletedCount = conversationService_1.conversationService.cleanupOldConversations(maxAgeHours);
        res.json({
            success: true,
            data: { deletedCount },
            message: `Cleaned up ${deletedCount} old conversations`
        });
    }
    catch (error) {
        console.error('Error in cleanupOldConversations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cleanup conversations'
        });
    }
};
exports.cleanupOldConversations = cleanupOldConversations;
//# sourceMappingURL=chatController.js.map