import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import { generalAuthLimiter, userBasedLimiter } from '../utils/rate-limiter';
import { verifyCSRFJWT } from '../middleware/csrf-jwt.middleware';

const router: Router = express.Router();

// strict rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
  skipSuccessfulRequests: true, // don't count successful requests towards the limit
})

// Rate limiting for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: 'Too many password reset attempts, please try again later.',
});

// Public routes (no authentication required) - with CSRF protection
router.post('/register', generalAuthLimiter, verifyCSRFJWT, authController.register);
router.post('/login', loginLimiter, verifyCSRFJWT, authController.login);
router.post('/refresh', verifyCSRFJWT, authController.refreshToken);
router.post('/forgot-password', passwordResetLimiter, verifyCSRFJWT, authController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, verifyCSRFJWT, authController.resetPassword);

// Protected routes (authentication required) - with CSRF protection
router.post('/logout', authenticate, verifyCSRFJWT, authController.logout);
router.get('/profile', userBasedLimiter, authenticate, authController.getProfile);

export default router;