import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

interface ApiResponse {
  message: string;
  [key: string]: any;
}

interface ExternalApiData {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface PostDataRequest {
  data: any;
}

// Example API endpoint
router.get('/test', (req: Request, res: Response<ApiResponse>) => {
  res.json({ message: 'TypeScript API endpoint is working!' });
});

// Example external API call endpoint using native fetch
router.get('/external-data', async (req: Request, res: Response<ExternalApiData | { error: string }>) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    const data = await response.json() as ExternalApiData;
    res.json(data);
  } catch (error) {
    console.error('External API error:', error);
    res.status(500).json({ error: 'Failed to fetch external data' });
  }
});

// POST endpoint example
router.post('/data', (req: Request<{}, ApiResponse, PostDataRequest>, res: Response<ApiResponse>) => {
  const { data } = req.body;
  res.json({ 
    message: 'Data received successfully',
    receivedData: data,
    timestamp: new Date().toISOString()
  });
});

export default router;