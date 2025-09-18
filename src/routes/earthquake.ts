import express, { Router } from 'express';
import earthquakeController from '../controllers/earthquake.controller';

const router: Router = express.Router();

// CRUD Operations
router.post('/', earthquakeController.createEarthquake);
router.get('/', earthquakeController.getAllEarthquakes);
router.get('/stats', earthquakeController.getEarthquakeStats);
router.get('/:id', earthquakeController.getEarthquakeById);
router.put('/:id', earthquakeController.updateEarthquake);
router.delete('/:id', earthquakeController.deleteEarthquake);

export default router;