# Authentication System Documentation

## Overview
This authentication system implements JWT-based authentication with refresh tokens, role-based access control, and password reset functionality.

## Features
- ✅ User registration and login
- ✅ JWT access tokens (short-lived, 15 minutes)
- ✅ Refresh tokens (long-lived, 7 days)
- ✅ Role-based access control (admin, moderator, user)
- ✅ Permission-based access control
- ✅ Password reset functionality
- ✅ Secure password hashing with bcrypt
- ✅ Token rotation on refresh

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/refresh` | Refresh access token | No |
| POST | `/logout` | User logout | Yes |
| GET | `/profile` | Get user profile | Yes |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password | No |

### Request/Response Examples

#### Register User
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response: Same as registration
```

#### Refresh Token
```json
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response:
{
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

## User Roles & Permissions

### Roles
- **user**: Basic access level
- **moderator**: Can manage content
- **admin**: Full system access

### Permission Matrix
| Permission | User | Moderator | Admin |
|------------|------|-----------|-------|
| read:own-profile | ✅ | ✅ | ✅ |
| read:earthquakes | ✅ | ✅ | ✅ |
| write:earthquakes | ❌ | ✅ | ✅ |
| read:users | ❌ | ✅ | ✅ |
| delete:earthquakes | ❌ | ✅ | ✅ |
| manage:users | ❌ | ❌ | ✅ |

## Middleware Usage

### Authentication Middleware
```typescript
import { authenticate, authorize, requirePermission } from '../middleware/auth.middleware';

// Require authentication
router.get('/profile', authenticate, controller.getProfile);

// Require specific roles
router.delete('/users/:id', authenticate, authorize('admin'), controller.deleteUser);

// Require specific permissions
router.post('/earthquakes', authenticate, requirePermission('write:earthquakes'), controller.create);
```

### Protected Route Examples
```typescript
// Public routes
router.get('/earthquakes', controller.getAllEarthquakes);

// Authenticated users only
router.post('/earthquakes', authenticate, controller.createEarthquake);

// Moderators and admins only
router.put('/earthquakes/:id', authenticate, authorize('moderator', 'admin'), controller.updateEarthquake);

// Admins only
router.delete('/users/:id', authenticate, authorize('admin'), controller.deleteUser);
```

## Security Features

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- Minimum 6 character requirement
- No password stored in plain text

### Token Security
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are signed with different secrets
- Refresh token rotation on each refresh
- All sessions invalidated on password reset

### API Security
- CORS enabled
- Input validation on all endpoints
- Error messages don't reveal sensitive information
- Rate limiting recommended (not implemented yet)

## Environment Variables

```env
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Password Security
BCRYPT_ROUNDS=12

# Password Reset
RESET_TOKEN_EXPIRES_IN=1h
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'moderator', 'user') DEFAULT 'user',
  isActive BOOLEAN DEFAULT true,
  emailVerified BOOLEAN DEFAULT false,
  refreshToken TEXT NULL,
  resetPasswordToken VARCHAR(255) NULL,
  resetPasswordExpires DATETIME NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Testing

Use the `test-auth.http` file to test all authentication endpoints. Make sure to:

1. Start your server: `npm run dev`
2. Test registration and login
3. Copy the access token for protected routes
4. Test role-based access with different user roles

## Next Steps

### Recommended Enhancements
1. **Email Service**: Implement actual email sending for password reset
2. **Rate Limiting**: Add rate limiting to prevent brute force attacks
3. **Email Verification**: Require email verification on registration
4. **Account Lockout**: Lock accounts after failed login attempts
5. **Audit Logging**: Log authentication events
6. **Social Login**: Add Google/Facebook login options
7. **Two-Factor Authentication**: Add 2FA support

### Production Considerations
1. Use strong, unique JWT secrets
2. Enable HTTPS only
3. Set secure cookie flags
4. Implement proper logging
5. Add monitoring and alerting
6. Regular security audits