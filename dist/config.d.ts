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
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map