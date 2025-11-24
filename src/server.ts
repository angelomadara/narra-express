// Set Node.js memory limit for 512MB server
process.env.NODE_OPTIONS = '--max-old-space-size=384';

import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { corsOptions } from './config/cors';
import { generateCSRFJWT } from './middleware/csrf-jwt.middleware';
// Import and register routes

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Only in production
}
app.use(cors(corsOptions));
app.use(express.json({ limit: '500kb' })); // Reduced from 1mb
app.use(express.urlencoded({ extended: true, limit: '500kb' }));

// CSRF Protection - Generate tokens for all requests
app.use(generateCSRFJWT);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Express API Backend with TypeScript is running!' });
});

// CSRF Token endpoint
app.get('/csrf-token', (req: Request, res: Response) => {
  const extendedReq = req as Request & { csrfToken?: string };
  res.json({ 
    csrfToken: extendedReq.csrfToken || 'Token generation failed',
    message: 'CSRF token generated successfully'
  });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Lazy load routes only when needed
const registerRoutes = async () => {
  const { registerRoutes: register } = await import('./routes');
  register(app);
};

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error occurred:", err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Log memory info on startup
  const mem = process.memoryUsage();
  console.log(`RSS: ${Math.round(mem.rss / 1024 / 1024)}MB`);
  console.log(`HEAP_USED: ${Math.round(mem.heapUsed / 1024 / 1024)}MB`);
  console.log(`HEAP_TOTAL: ${Math.round(mem.heapTotal / 1024 / 1024)}MB`);

  // Initialize database connection
  await connectDB();
  
  // Load routes after DB connection
  await registerRoutes();
});