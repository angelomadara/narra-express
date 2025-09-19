import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO, ResetPasswordDTO } from '../dto/register.dto';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * User Registration
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: RegisterDTO = req.body;
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Email, password, firstName, and lastName are required'
        });
        return;
      }

      // Password strength validation
      if (userData.password.length < 6) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      const result = await this.authService.register(userData);
      
      res.status(201).json({
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof Error && error.message === 'User already exists with this email') {
        res.status(409).json({
          error: 'Registration failed',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * User Login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDTO = req.body;
      
      // Basic validation
      if (!email || !password) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Email and password are required'
        });
        return;
      }

      const result = await this.authService.login(email, password);
      
      res.json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error && 
          (error.message === 'Invalid credentials' || error.message === 'Account is deactivated')) {
        res.status(401).json({
          error: 'Authentication failed',
          message: error.message
        });
        return;
      }

      res.status(500).json({
        error: 'Login failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Refresh Access Token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          error: 'Validation failed',
          message: 'Refresh token is required'
        });
        return;
      }

      const result = await this.authService.refreshToken(refreshToken);
      
      res.json({
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      console.error('Token refresh error:', error);
      
      res.status(401).json({
        error: 'Token refresh failed',
        message: 'Invalid refresh token'
      });
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

      // You might want to fetch fresh user data from database
      res.json({
        message: 'Profile retrieved successfully',
        data: {
          userId: req.user.userId,
          email: req.user.email,
          role: req.user.role
        }
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