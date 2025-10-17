import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'No token provided' 
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // 2. Verify token
    const decoded = authService.verifyAccessToken(token);

    // 3. Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Access denied', 
      message: 'Invalid token' 
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated first
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Authentication required' 
      });
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Optional: More granular permission checking
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied', 
        message: 'Authentication required' 
      });
    }

    // Define role-based permissions
    const rolePermissions: { [key: string]: string[] } = {
      'user': ['read:own-profile', 'read:earthquakes'],
      'moderator': ['read:own-profile', 'read:earthquakes', 'write:earthquakes', 'read:users'],
      'admin': ['*'] // All permissions
    };

    const userPermissions = rolePermissions[req.user.role] || [];
    
    if (!userPermissions.includes('*') && !userPermissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `Permission '${permission}' required` 
      });
    }

    next();
  };
};

// Usage Examples:
// router.get('/profile', authenticate, userController.getProfile);
// router.get('/admin', authenticate, authorize('admin'), adminController.dashboard);
// router.delete('/users/:id', authenticate, authorize('admin', 'moderator'), userController.delete);
// router.post('/earthquakes', authenticate, requirePermission('write:earthquakes'), earthquakeController.create);