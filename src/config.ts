// Configuration file for the Resume AI API
import dotenv from 'dotenv';

dotenv.config();

export interface RateLimitConfig {
  windowMs: number;
  max: number;
}

export interface AIConfig {
  openaiApiKey?: string;
}

export interface Config {
  port: number;
  nodeEnv: string;
  allowedOrigins: string[];
  rateLimit: RateLimitConfig;
  ai: AIConfig;
}

const config: Config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  allowedOrigins: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001'],
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
  },
  
  // AI service configuration
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  
};

export default config;
