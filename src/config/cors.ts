import { CorsOptions } from 'cors';

const getAllowedOrigins = (): string[] => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return [
        process.env.FRONTEND_URL || 'https://yourdomain.com',
        'https://www.yourdomain.com',
        // Add other production domains
      ];
    
    case 'staging':
      return [
        'https://staging.yourdomain.com',
        'http://localhost:3000',
        'http://localhost:3001',
      ];
    
    case 'development':
    default:
      return [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5173', // Vite
        'http://localhost:4200', // Angular
        'http://localhost:8080', // Vue CLI
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
      ];
  }
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  maxAge: 86400, // 24 hours
};