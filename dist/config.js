"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000', 'http://localhost:3001'],
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
    },
    ai: {
        openaiApiKey: process.env.OPENAI_API_KEY,
    },
};
exports.default = config;
//# sourceMappingURL=config.js.map