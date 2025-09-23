import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppDataSource } from '../config/database';

// Extend Request interface to include CSRF token
declare global {
  namespace Express {
    interface Request {
      csrfToken?: string;
      session?: {
        csrfSecret?: string;
      };
    }
  }
}

export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly SECRET_LENGTH = 32;

  /**
   * Generate a cryptographically secure random token
   */
  static generateSecret(): string {
    return crypto.randomBytes(this.SECRET_LENGTH).toString('hex');
  }

  /**
   * Generate CSRF token from secret
   */
  static generateToken(secret: string): string {
    const token = crypto.randomBytes(this.TOKEN_LENGTH).toString('hex');
    const hash = crypto.createHmac('sha256', secret).update(token).digest('hex');
    return `${token}.${hash}`;
  }

  /**
   * Verify CSRF token against secret
   */
  static verifyToken(token: string, secret: string): boolean {
    try {
      const [tokenPart, hashPart] = token.split('.');
      if (!tokenPart || !hashPart) return false;

      const expectedHash = crypto.createHmac('sha256', secret).update(tokenPart).digest('hex');
      return crypto.timingSafeEqual(Buffer.from(hashPart, 'hex'), Buffer.from(expectedHash, 'hex'));
    } catch (error) {
      return false;
    }
  }

  /**
   * Middleware to generate and attach CSRF token to request
   */
  static generateCSRFToken() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Initialize session if not exists (you might use express-session instead)
      if (!req.session) {
        req.session = {};
      }

      // Generate secret if not exists
      if (!req.session.csrfSecret) {
        req.session.csrfSecret = CSRFProtection.generateSecret();
      }

      // Generate token
      req.csrfToken = CSRFProtection.generateToken(req.session.csrfSecret);

      // Add token to response headers for SPA consumption
      res.setHeader('X-CSRF-Token', req.csrfToken);

      next();
    };
  }

  /**
   * Middleware to verify CSRF token on state-changing requests
   */
  static verifyCSRFToken() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Skip verification for safe methods
      if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
      }

      // Skip verification for API endpoints using JWT (stateless)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return next(); // JWT-based APIs don't need CSRF protection
      }

      const token = req.headers['x-csrf-token'] as string || 
                   req.body._csrf || 
                   req.query._csrf as string;

      const secret = req.session?.csrfSecret;

      if (!token || !secret || !CSRFProtection.verifyToken(token, secret)) {
        return res.status(403).json({
          error: 'CSRF token validation failed',
          message: 'Invalid or missing CSRF token'
        });
      }

      next();
    };
  }
}

// Export middleware functions
export const generateCSRFToken = CSRFProtection.generateCSRFToken();
export const verifyCSRFToken = CSRFProtection.verifyCSRFToken();