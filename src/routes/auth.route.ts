import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';
import { generalAuthLimiter, loginLimiter, passwordResetLimiter, userBasedLimiter } from '../utils/rate-limiter';
import { verifyCSRFJWT } from '../middleware/csrf-jwt.middleware';
import { createUserValidation } from '../validations/auth.validation';

const router: Router = express.Router();

// Public routes (no authentication required) - with CSRF protection
router.post('/register', generalAuthLimiter, verifyCSRFJWT, createUserValidation, authController.register);
router.post('/login', loginLimiter, verifyCSRFJWT, authController.login);
router.post('/refresh', verifyCSRFJWT, authController.refreshToken);
router.post('/forgot-password', passwordResetLimiter, verifyCSRFJWT, authController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, verifyCSRFJWT, authController.resetPassword);

// Protected routes (authentication required) - with CSRF protection
router.post('/logout', authenticate, verifyCSRFJWT, authController.logout);
router.get('/profile', userBasedLimiter, authenticate, authController.getProfile);

export default router;