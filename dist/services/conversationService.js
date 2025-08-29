"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationService = exports.ConversationService = void 0;
const uuid_1 = require("uuid");
const conversations = new Map();
class ConversationService {
    createConversation() {
        const conversationId = (0, uuid_1.v4)();
        const conversation = {
            id: conversationId,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isContextInjected: false
        };
        conversations.set(conversationId, conversation);
        return conversation;
    }
    getConversation(conversationId) {
        return conversations.get(conversationId) || null;
    }
    addMessage(conversationId, role, content) {
        const conversation = this.getConversation(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
        const message = {
            id: (0, uuid_1.v4)(),
            role,
            content,
            timestamp: new Date(),
            conversationId
        };
        conversation.messages.push(message);
        conversation.updatedAt = new Date();
        return message;
    }
    markContextInjected(conversationId) {
        const conversation = this.getConversation(conversationId);
        if (conversation) {
            conversation.isContextInjected = true;
        }
    }
    getMessageHistory(conversationId, includeSystem = true) {
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
    isFirstUserMessage(conversationId) {
        const conversation = this.getConversation(conversationId);
        if (!conversation) {
            return true;
        }
        const userMessages = conversation.messages.filter(msg => msg.role === 'user');
        return userMessages.length === 0;
    }
    getAllConversations() {
        return Array.from(conversations.values());
    }
    deleteConversation(conversationId) {
        return conversations.delete(conversationId);
    }
    cleanupOldConversations(maxAgeHours = 24) {
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
exports.ConversationService = ConversationService;
exports.conversationService = new ConversationService();
//# sourceMappingURL=conversationService.js.map