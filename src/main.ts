import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS - More permissive for mobile apps
    app.enableCors({
        origin: true, // Allow all origins for mobile app testing
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Origin',
            'X-Requested-With',
            'Access-Control-Allow-Origin',
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Methods'
        ],
        exposedHeaders: ['Authorization', 'Content-Type'],
        preflightContinue: false,
        optionsSuccessStatus: 200
    });

    // Add middleware to handle OPTIONS requests
    app.use((req, res, next) => {
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
            res.status(200).end();
            return;
        }
        next();
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