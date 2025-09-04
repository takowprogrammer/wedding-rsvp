import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS - More permissive for mobile apps
    app.enableCors({
        origin: function (origin, callback) {
            console.log('Request origin:', origin);
            
            // Allow requests with no origin (like mobile apps)
            if (!origin) return callback(null, true);
            
            // Allow localhost on any port (for Flutter web development)
            if (origin.match(/^http:\/\/localhost:\d+$/)) {
                return callback(null, true);
            }
            
            // Allow 127.0.0.1 on any port
            if (origin.match(/^http:\/\/127\.0\.0\.1:\d+$/)) {
                return callback(null, true);
            }
            
            // Allow your production domains
            const allowedOrigins = [
                'https://wedding-rsvp-production.up.railway.app',
                'https://rsvp-fe-lovat.vercel.app',
            ];
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            
            console.log('CORS rejected origin:', origin);
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
            'User-Agent',
            'Cache-Control',
            'Pragma'
        ],
        exposedHeaders: ['Authorization', 'Content-Type'],
        preflightContinue: false,
        optionsSuccessStatus: 200
    });

    // Enable validation
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    // Set global prefix
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 5000;
    await app.listen(port);

    console.log(`🚀 Application is running on port ${port}`);
}

bootstrap(); 