import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  timestamp: string;
}

// Mock weather data
const mockWeatherData: WeatherData[] = [
  { city: 'New York', temperature: 22, condition: 'Sunny', timestamp: new Date().toISOString() },
  { city: 'London', temperature: 15, condition: 'Cloudy', timestamp: new Date().toISOString() },
  { city: 'Tokyo', temperature: 28, condition: 'Rainy', timestamp: new Date().toISOString() }
];

// Get all weather data
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Weather data retrieved successfully',
    data: mockWeatherData
  });
});

// Get weather by city
router.get('/:city', (req: Request, res: Response) => {
  const city = req.params.city.toLowerCase();
  const weather = mockWeatherData.find(w => w.city.toLowerCase() === city);
  
  if (!weather) {
    return res.status(404).json({ error: 'City not found' });
  }
  
  res.json({
    message: `Weather data for ${weather.city}`,
    data: weather
  });
});

// Add new weather data
router.post('/', (req: Request, res: Response) => {
  const { city, temperature, condition } = req.body;
  
  if (!city || temperature === undefined || !condition) {
    return res.status(400).json({ error: 'Missing required fields: city, temperature, condition' });
  }
  
  const newWeather: WeatherData = {
    city,
    temperature: parseFloat(temperature),
    condition,
    timestamp: new Date().toISOString()
  };
  
  mockWeatherData.push(newWeather);
  
  res.status(201).json({
    message: 'Weather data added successfully',
    data: newWeather
  });
});

export default router;