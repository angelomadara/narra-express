import express, { Router } from 'express';
import ExampleController from '../controllers/example.controller';
import { authenticate, authorize, requirePermission } from '../middleware';
// import { authenticate, authorize, requirePermission } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes (no authentication required)

router.get('/logs', ExampleController.getTestLogging);

// Protected routes (authentication required)
router.post('/', 
  authenticate, 
  requirePermission('write:example'), 
  ExampleController.createExample
);

router.put('/:id', 
  authenticate, 
  requirePermission('write:example'), 
  ExampleController.updateExample
);

// Admin/Moderator only routes
router.delete('/:id', 
  authenticate, 
  authorize('admin', 'moderator'), 
  ExampleController.deleteExample
);

export default router;