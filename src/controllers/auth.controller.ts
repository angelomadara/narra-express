import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO, ResetPasswordDTO } from '../dto/register.dto';
import { BaseController } from './base.controller';

class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super(); // Call base controller constructor for method binding
    this.authService = new AuthService();
  }

  /**
   * User Registration
   */
  async register(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    
    // Handle express-validator validation errors
    if (!this.validateRequest(req, res)) {
      return;
    }
   
    try {
      const userData: RegisterDTO = req.body;

      const result = await this.authService.register(userData);

      this.sendSuccessResponse(res, 201, 'User registered successfully', result);
    } catch (error) {
      // Handle specific registration errors
      if (error instanceof Error && error.message === 'User already exists with this email') {
        this.sendErrorResponse(res, 409, 'Registration failed', error.message);
        return;
      }

      this.handleError(error, res, 'Registration');
    }
  }

  /**
   * User Login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDTO = req.body;
      
      // Validate required fields
      if (!this.validateRequiredFields(req, res, ['email', 'password'])) {
        return;
      }

      const result = await this.authService.login(email, password);
      
      this.sendSuccessResponse(res, 200, 'Login successful', result);
    } catch (error) {
      // Handle specific login errors
      if (error instanceof Error && 
          (error.message === 'Invalid credentials' || error.message === 'Account is deactivated')) {
        this.sendErrorResponse(res, 401, 'Authentication failed', error.message);
        return;
      }

      this.handleError(error, res, 'Login');
    }
  }

  /**
   * Refresh Access Token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!this.validateRequiredFields(req, res, ['refreshToken'])) {
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      this.sendSuccessResponse(res, 200, 'Token refreshed successfully', result);
    } catch (error) {
      this.sendErrorResponse(res, 401, 'Token refresh failed', 'Invalid refresh token');
    }
  }

  /**
   * User Logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
        return;
      }

      await this.authService.logout(req.user.userId);
      
      res.json({
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      res.status(500).json({
        error: 'Logout failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get Current User Profile
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'Authentication required',
          message: 'User not authenticated'
        });
        return;
      }

      // query the user information in the database
      const profile = await this.authService.getUserById(req.user.userId);

      res.json({
        message: 'Profile retrieved successfully',
        data: profile
      });
    } catch (error) {
      console.error('Get profile error:', error);
      
      res.status(500).json({
        error: 'Failed to get profile',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Request Password Reset
   */
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Email is required'
        });
        return;
      }

      await this.authService.requestPasswordReset(email);
      
      // Always return success for security (don't reveal if email exists)
      res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      
      res.status(500).json({
        error: 'Password reset request failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Reset Password
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword }: ResetPasswordDTO = req.body;
      
      if (!token || !newPassword) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Token and new password are required'
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      await this.authService.resetPassword(token, newPassword);
      
      res.json({
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error instanceof Error && error.message === 'Invalid or expired reset token') {
        res.status(400).json({
          error: 'Password reset failed',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Password reset failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new AuthController();