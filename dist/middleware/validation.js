"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConversationId = exports.validateChatRequest = exports.validateCustomSuggestionsRequest = exports.validateJobMatchRequest = exports.validateAnalysisRequest = exports.validateIdParam = exports.validateResumeData = void 0;
const validateResumeData = (req, res, next) => {
    const { name, email, title } = req.body;
    if (!name || !email || !title) {
        res.status(400).json({
            success: false,
            error: 'Missing required fields: name, email, and title are required'
        });
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            success: false,
            error: 'Invalid email format'
        });
        return;
    }
    if (name.length < 2 || name.length > 100) {
        res.status(400).json({
            success: false,
            error: 'Name must be between 2 and 100 characters'
        });
        return;
    }
    if (title.length < 2 || title.length > 100) {
        res.status(400).json({
            success: false,
            error: 'Title must be between 2 and 100 characters'
        });
        return;
    }
    next();
};
exports.validateResumeData = validateResumeData;
const validateIdParam = (req, res, next) => {
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
exports.validateIdParam = validateIdParam;
const validateAnalysisRequest = (req, res, next) => {
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
exports.validateAnalysisRequest = validateAnalysisRequest;
const validateJobMatchRequest = (req, res, next) => {
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
exports.validateJobMatchRequest = validateJobMatchRequest;
const validateCustomSuggestionsRequest = (req, res, next) => {
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
exports.validateCustomSuggestionsRequest = validateCustomSuggestionsRequest;
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