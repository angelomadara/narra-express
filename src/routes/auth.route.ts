import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate, generalAuthLimiter, loginLimiter, passwordResetLimiter, userBasedLimiter, verifyCSRFJWT } from '../middleware';
import { createUserValidation } from '../middleware/validations';

const router: Router = express.Router();

// Public routes (no authentication required) - with CSRF protection
router.post('/register',createUserValidation, generalAuthLimiter, verifyCSRFJWT, authController.register);
router.post('/login', loginLimiter, verifyCSRFJWT, authController.login);
router.post('/refresh', verifyCSRFJWT, authController.refreshToken);
router.post('/forgot-password', passwordResetLimiter, verifyCSRFJWT, authController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, verifyCSRFJWT, authController.resetPassword);

// Protected routes (authentication required) - with CSRF protection
router.post('/logout', authenticate, verifyCSRFJWT, authController.logout);
router.get('/profile', userBasedLimiter, authenticate, authController.getProfile);

export default router;