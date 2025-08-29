"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("./config"));
const api_1 = __importDefault(require("./routes/api"));
const app = (0, express_1.default)();
const PORT = config_1.default.port;
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.rateLimit.windowMs,
    max: config_1.default.rateLimit.max,
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
app.use((0, cors_1.default)({
    origin: config_1.default.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }
    });
});
app.use('/api', api_1.default);
app.get('/', (_req, res) => {
    res.json({
        success: true,
        data: {
            message: 'Resume AI API',
            version: '1.0.0',
            endpoints: {
                health: '/health',
                api: '/api'
            }
        }
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `The requested route ${req.originalUrl} does not exist.`
    });
});
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    const isDevelopment = config_1.default.nodeEnv === 'development';
    res.status(500).json({
        success: false,
        error: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { data: { stack: err.stack } })
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
    console.log(`🔧 Environment: ${config_1.default.nodeEnv}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map