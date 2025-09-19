import express, { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes (authentication required)
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;