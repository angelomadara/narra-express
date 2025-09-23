import rateLimit from "express-rate-limit";
import { Request } from 'express';

// General rate limiting for other auth routes
export const generalAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many requests, please try again later.',
});

/**
 * use this to identify and group requests by user
 * If multiple users share the same IP (office network, family), each user gets their own rate limit instead of sharing one limit.
 */
export const userBasedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: (req: Request) => {
    const hash = (req as any).rateLimitHash ? ` (Key: ${(req as any).rateLimitHash})` : '';
    return `Too many requests, please try again later.${hash}`;
  },
  keyGenerator: (req) => {
    let token = req.headers['authorization'] as string;
    token = token.replace("Bearer ", "")
    // Ensure we always return a string
    if (token) {
      const key = `${req.ip}.${token}`;
      console.log(key)
      return key;
    }
    const fallbackKey = req.ip || 'unknown';
    console.log(fallbackKey)
    return fallbackKey;
  }
});


// strict rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
  skipSuccessfulRequests: true, // don't count successful requests towards the limit
})

// Rate limiting for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: 'Too many password reset attempts, please try again later.',
});