import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

interface User {
  id: number;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Get all users
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Users retrieved successfully',
    data: mockUsers
  });
});

// Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    message: 'User found',
    data: user
  });
});

export default router;