import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS - More permissive for mobile apps
    app.enableCors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps)
            if (!origin) return callback(null, true);
            
            // Allow any localhost or 127.0.0.1 with any port
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
            
            // Allow your production domains
            const allowedOrigins = [
                'https://wedding-rsvp-production.up.railway.app',
                'https://rsvp-fe-lovat.vercel.app/'
            ];
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            
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
            'User-Agent'
        ],
        exposedHeaders: ['Authorization', 'Content-Type'],
        preflightContinue: false,
        optionsSuccessStatus: 200
    });
    // app.enableCors({
    //     origin: [
    //         process.env.FRONTEND_URL || 'http://localhost:3000',
    //         'http://localhost:*',
    //         'http://127.0.0.1:*'
    //     ],
    //     credentials: true,
    //     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    //     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    // });

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