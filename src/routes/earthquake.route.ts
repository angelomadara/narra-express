import express, { Router } from 'express';
import earthquakeController from '../controllers/earthquake.controller';

const router: Router = express.Router();

// CRUD Operations - Bind methods to preserve 'this' context
// router.post('/', earthquakeController.createEarthquake.bind(earthquakeController));
// router.get('/', earthquakeController.getAllEarthquakes.bind(earthquakeController));
// router.get('/stats', earthquakeController.getEarthquakeStats.bind(earthquakeController));
// router.get('/:id', earthquakeController.getEarthquakeById.bind(earthquakeController));
// router.put('/:id', earthquakeController.updateEarthquake.bind(earthquakeController));
// router.delete('/:id', earthquakeController.deleteEarthquake.bind(earthquakeController));

router.post('/', earthquakeController.createEarthquake);
router.get('/', earthquakeController.getAllEarthquakes);
router.get('/stats', earthquakeController.getEarthquakeStats);
router.get('/:id', earthquakeController.getEarthquakeById);
router.put('/:id', earthquakeController.updateEarthquake);
router.delete('/:id', earthquakeController.deleteEarthquake);

export default router;