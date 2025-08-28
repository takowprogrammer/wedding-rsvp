import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import { getCorsConfig } from './config/cors.config';

async function bootstrap() {
    // Determine log level from environment or default to debug
    const logLevel = (process.env.LOG_LEVEL || 'debug') as LogLevel;
    const logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

    console.log(`🔧 Starting application with log level: ${logLevel}`);
    console.log(`📝 Available log levels: ${logLevels.join(', ')}`);

    // Create app with detailed logging
    const app = await NestFactory.create(AppModule, {
        logger: logLevels,
        bufferLogs: true,
    });

    // Enable CORS with environment-specific configuration
    const corsOptions = getCorsConfig();
    console.log('🌍 CORS Configuration:', corsOptions);
    app.enableCors(corsOptions);

    // Add explicit CORS preflight handler
    app.use((req, res, next) => {
        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
            const origin = req.headers.origin;
            const allowedOrigins = corsOptions.origin;

            console.log('🚁 CORS Preflight Request:');
            console.log('   Origin:', origin);
            console.log('   Allowed Origins:', allowedOrigins);

            if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
                res.header('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
                res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
                res.header('Access-Control-Allow-Credentials', 'true');
                res.status(200).end();
                return;
            }
        }
        next();
    });

    // Enable validation with custom configuration
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: {
            target: false,
            value: false,
        },
        // Add logging for validation errors
        exceptionFactory: (errors) => {
            console.log('❌ Validation errors:', JSON.stringify(errors, null, 2));
            return new Error('Validation failed');
        },
    }));

    // Set global prefix
    app.setGlobalPrefix('api');

    // Add request logging middleware with CORS debugging
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const userAgent = req.get('User-Agent') || 'Unknown';
        const origin = req.get('Origin') || 'No Origin';
        const referer = req.get('Referer') || 'No Referer';

        console.log(`📡 [${timestamp}] ${method} ${url}`);
        console.log(`   👤 User-Agent: ${userAgent}`);
        console.log(`   🌍 Origin: ${origin}`);
        console.log(`   🔗 Referer: ${referer}`);

        // Log CORS preflight requests
        if (method === 'OPTIONS') {
            console.log(`   🚁 CORS Preflight Request`);
            console.log(`   📋 Request Headers:`, req.headers);
        }

        next();
    });

    const port = process.env.PORT || 8080;
    await app.listen(port);

    const logger = new Logger('Bootstrap');
    logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
    logger.log(`📝 Logging level: ${logLevel.toUpperCase()}`);
    logger.log(`🔍 Validation pipe: ENABLED with detailed error logging`);
    logger.log(`📡 Request logging: ENABLED`);
    logger.log(`🌍 CORS: ENABLED`);
}

bootstrap(); 