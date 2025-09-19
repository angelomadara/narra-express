import { RegisterDTO, AuthResponse, TokenResponse } from "../dto/register.dto";
import { User } from "../models/user.model";
import { AppDataSource } from "../config/database";
import { Repository } from "typeorm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Registration
  async register(userData: RegisterDTO): Promise<AuthResponse> {
    // 1. Check if user already exists
    const existingUser = await this.userRepository.findOne({ 
      where: { email: userData.email } 
    });
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // 2. Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // 3. Create user
    const user = new User();
    user.email = userData.email;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.password = hashedPassword;
    user.role = 'user'; // Default role

    const savedUser = await this.userRepository.save(user);

    // 4. Generate tokens
    const accessToken = this.generateAccessToken(savedUser);
    const refreshToken = this.generateRefreshToken(savedUser);

    // 5. Store refresh token
    savedUser.refreshToken = refreshToken;
    await this.userRepository.save(savedUser);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        isActive: savedUser.isActive
      },
      accessToken,
      refreshToken
    };
  }

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    // 1. Find user
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // 3. Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // 4. Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // 5. Store refresh token
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive
      },
      accessToken,
      refreshToken
    };
  }

  // Refresh Token
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    try {
      // 1. Verify refresh token
      const decoded = (jwt.verify as any)(refreshToken, secret) as { userId: number };
      
      // 2. Find user and validate stored refresh token
      const user = await this.userRepository.findOne({ 
        where: { id: decoded.userId, refreshToken } 
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      // 3. Generate new access token
      const newAccessToken = this.generateAccessToken(user);
      
      // 4. Optionally rotate refresh token (recommended for security)
      const newRefreshToken = this.generateRefreshToken(user);
      user.refreshToken = newRefreshToken;
      await this.userRepository.save(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Password Reset Request
  async requestPasswordReset(email: string): Promise<void> {
    // 1. Find user
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour expiry

    // 3. Store reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await this.userRepository.save(user);

    // 4. Send reset email (implement email service)
    // await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  // Password Reset Confirm
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // 1. Find user with valid reset token
    const user = await this.userRepository.findOne({
      where: {
        resetPasswordToken: token,
      }
    });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    // 2. Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // 3. Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined; // Invalidate all sessions

    await this.userRepository.save(user);
  }

  // Logout
  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.refreshToken = undefined;
      await this.userRepository.save(user);
    }
  }

  // Token Generation
  generateAccessToken(user: User): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    const payload = { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    };
    const options = { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' };
    
    return (jwt.sign as any)(payload, secret, options);
  }

  generateRefreshToken(user: User): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    const payload = { userId: user.id };
    const options = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' };
    
    return (jwt.sign as any)(payload, secret, options);
  }

  // Verify Access Token
  verifyAccessToken(token: string): { userId: number; email: string; role: string } {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    try {
      return (jwt.verify as any)(token, secret) as { userId: number; email: string; role: string };
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }
}
