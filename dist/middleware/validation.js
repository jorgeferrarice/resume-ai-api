"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConversationId = exports.validateChatRequest = void 0;
const validateChatRequest = (req, res, next) => {
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
    if (conversationId !== undefined) {
        if (typeof conversationId !== 'string' || conversationId.trim().length === 0) {
            res.status(400).json({
                success: false,
                error: 'Conversation ID must be a valid string'
            });
            return;
        }
    }
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
exports.validateChatRequest = validateChatRequest;
const validateConversationId = (req, res, next) => {
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
exports.validateConversationId = validateConversationId;
//# sourceMappingURL=validation.js.map