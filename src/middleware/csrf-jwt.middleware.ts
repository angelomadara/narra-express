/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class JWTCSRFProtection {
  /**
   * Generate CSRF token embedded in JWT
   */
  static generateCSRFJWT(userId?: number | string): string {
    const secret = process.env.CSRF_JWT_SECRET || 'csrf-secret-key';
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const payload = {
      nonce,
      userId: userId || null,
      timestamp: Date.now(),
      type: 'csrf'
    };

    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  /**
   * Verify CSRF JWT token
   */
  static verifyCSRFJWT(token: string, userId?: number | string): boolean {
    try {
      const secret = process.env.CSRF_JWT_SECRET || 'csrf-secret-key';
      const decoded = jwt.verify(token, secret) as any;

      // Verify token type
      if (decoded.type !== 'csrf') return false;

      // Verify user ID if provided
      if (userId && decoded.userId !== userId) return false;

      // Verify timestamp (additional security)
      const tokenAge = Date.now() - decoded.timestamp;
      const maxAge = 60 * 60 * 1000; // 1 hour
      if (tokenAge > maxAge) return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Middleware to generate CSRF JWT token
   */
  static generateCSRFJWTMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?.userId;
      const csrfToken = JWTCSRFProtection.generateCSRFJWT(userId);
      
      // Add to response headers
      res.setHeader('X-CSRF-Token', csrfToken);
      
      // Add to request for template rendering
      req.csrfToken = csrfToken;
      
      next();
    };
  }

  /**
   * Middleware to verify CSRF JWT token
   */
  static verifyCSRFJWTMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip verification for safe methods
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
      }

      const token = req.headers['x-csrf-token'] as string || 
                   req.body._csrf || 
                   req.query._csrf as string;

      if (!token) {
        return res.status(403).json({
          error: 'CSRF token required',
          message: 'CSRF token is missing'
        });
      }

      const userId = req.user?.userId;
      if (!JWTCSRFProtection.verifyCSRFJWT(token, userId)) {
        return res.status(403).json({
          error: 'CSRF token validation failed',
          message: 'Invalid CSRF token'
        });
      }

      next();
    };
  }
}

export const generateCSRFJWT = JWTCSRFProtection.generateCSRFJWTMiddleware();
export const verifyCSRFJWT = JWTCSRFProtection.verifyCSRFJWTMiddleware();