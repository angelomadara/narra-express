import express, { Router } from 'express';
import earthquakeController from '../controllers/earthquake.controller';
import { authenticate, authorize, requirePermission } from '../middleware/auth.middleware';

const router: Router = express.Router();

// Public routes (no authentication required)
router.get('/', earthquakeController.getAllEarthquakes);
router.get('/stats', earthquakeController.getEarthquakeStats);
router.get('/:id', earthquakeController.getEarthquakeById);

// Protected routes (authentication required)
router.post('/', 
  authenticate, 
  requirePermission('write:earthquakes'), 
  earthquakeController.createEarthquake
);

router.put('/:id', 
  authenticate, 
  requirePermission('write:earthquakes'), 
  earthquakeController.updateEarthquake
);

// Admin/Moderator only routes
router.delete('/:id', 
  authenticate, 
  authorize('admin', 'moderator'), 
  earthquakeController.deleteEarthquake
);

export default router;