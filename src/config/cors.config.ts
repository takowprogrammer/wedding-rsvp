export const corsConfig = {
    development: {
        origin: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        credentials: true,
        optionsSuccessStatus: 200,
        preflightContinue: false,
    },
    production: {
        origin: [
            // Add your Vercel frontend URL here
            'https://your-frontend-domain.vercel.app', // Replace with actual domain
            process.env.FRONTEND_URL, // Environment variable
        ].filter(Boolean),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
        credentials: true,
        optionsSuccessStatus: 200,
        preflightContinue: false,
    }
};

export const getCorsConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    return corsConfig[env] || corsConfig.development;
};
