import express, { Router } from 'express';
import ExampleController from '../controllers/example.controller';
import { authenticate, authorize, requirePermission } from '../middleware';
// import { authenticate, authorize, requirePermission } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes (no authentication required)
router.get('/', ExampleController.getAllEarthquakes);
router.get('/stats', ExampleController.getEarthquakeStats);
router.get('/:id', ExampleController.getEarthquakeById);

// Protected routes (authentication required)
router.post('/', 
  authenticate, 
  requirePermission('write:earthquakes'), 
  ExampleController.createEarthquake
);

router.put('/:id', 
  authenticate, 
  requirePermission('write:earthquakes'), 
  ExampleController.updateEarthquake
);

// Admin/Moderator only routes
router.delete('/:id', 
  authenticate, 
  authorize('admin', 'moderator'), 
  ExampleController.deleteEarthquake
);

export default router;