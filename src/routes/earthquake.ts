import express, { Router } from 'express';
import earthquakeController from '../controllers/earthquakeController';

const router: Router = express.Router();

// Get recent earthquakes from the last 24 hours
router.get('/', earthquakeController.getRecentEarthquakes);

// Get earthquakes by minimum magnitude
router.get('/magnitude/:minMag', earthquakeController.getEarthquakesByMagnitude);

// Get significant earthquakes from the past week
router.get('/significant', earthquakeController.getSignificantEarthquakes);

// Get earthquake statistics
router.get('/stats', earthquakeController.getEarthquakeStats);

export default router;