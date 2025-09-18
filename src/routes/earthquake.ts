import express, { Request, Response, Router } from 'express';
import axios, { AxiosResponse } from 'axios';

const router: Router = express.Router();

interface EarthquakeData {
  magnitude: number;
  place: string;
  time: number;
  coordinates: [number, number, number];
}

interface USGSResponse {
  features: Array<{
    properties: {
      mag: number;
      place: string;
      time: number;
    };
    geometry: {
      coordinates: [number, number, number];
    };
  }>;
}

// Get recent earthquakes
router.get('/', async (req: Request, res: Response) => {
  try {
    const response: AxiosResponse<USGSResponse> = await axios.get(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );

    const earthquakes: EarthquakeData[] = response.data.features.map(feature => ({
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      coordinates: feature.geometry.coordinates
    }));

    res.json({
      message: 'Recent earthquakes data',
      count: earthquakes.length,
      data: earthquakes.slice(0, 10) // Return first 10
    });
  } catch (error) {
    console.error('Earthquake API error:', error);
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});

// Get earthquakes by minimum magnitude
router.get('/magnitude/:minMag', async (req: Request, res: Response) => {
  try {
    const minMagnitude = parseFloat(req.params.minMag);
    
    if (isNaN(minMagnitude)) {
      return res.status(400).json({ error: 'Invalid magnitude value' });
    }

    const response: AxiosResponse<USGSResponse> = await axios.get(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );

    const earthquakes: EarthquakeData[] = response.data.features
      .filter(feature => feature.properties.mag >= minMagnitude)
      .map(feature => ({
        magnitude: feature.properties.mag,
        place: feature.properties.place,
        time: feature.properties.time,
        coordinates: feature.geometry.coordinates
      }));

    res.json({
      message: `Earthquakes with magnitude >= ${minMagnitude}`,
      count: earthquakes.length,
      data: earthquakes
    });
  } catch (error) {
    console.error('Earthquake API error:', error);
    res.status(500).json({ error: 'Failed to fetch earthquake data' });
  }
});

export default router;