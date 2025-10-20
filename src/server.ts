import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import xssClean from 'xss-clean';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { corsOptions } from './config/cors';
import { generateCSRFJWT } from './middleware/csrf-jwt.middleware';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '3000');

// Middleware
app.use(helmet()); // Set security-related HTTP headers
app.use(cors(corsOptions)); // <- apply cors config to all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Import and register routes
import { registerRoutes } from './routes';
import log from './services/log.service';
registerRoutes(app);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  log.error("Error occurred", err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  log.info(`Server is running on port ${PORT}`);
  log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize database connection
  await connectDB();
});