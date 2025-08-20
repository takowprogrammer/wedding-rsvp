"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logLevel = (process.env.LOG_LEVEL || 'debug');
    const logLevels = ['log', 'error', 'warn', 'debug', 'verbose'];
    console.log(`🔧 Starting application with log level: ${logLevel}`);
    console.log(`📝 Available log levels: ${logLevels.join(', ')}`);
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: logLevels,
        bufferLogs: true,
    });
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
            target: false,
            value: false,
        },
        exceptionFactory: (errors) => {
            console.log('❌ Validation errors:', JSON.stringify(errors, null, 2));
            return new Error('Validation failed');
        },
    }));
    app.setGlobalPrefix('api');
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const userAgent = req.get('User-Agent') || 'Unknown';
        console.log(`📡 [${timestamp}] ${method} ${url} - ${userAgent}`);
        next();
    });
    const port = process.env.PORT || 8080;
    await app.listen(port);
    const logger = new common_1.Logger('Bootstrap');
    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
    logger.log(`📝 Logging level: ${logLevel.toUpperCase()}`);
    logger.log(`🔍 Validation pipe: ENABLED with detailed error logging`);
    logger.log(`📡 Request logging: ENABLED`);
    logger.log(`🌍 CORS: ENABLED`);
}
bootstrap();
//# sourceMappingURL=main.js.map