import express, { Request, Response, Router } from 'express';
import axios, { AxiosResponse } from 'axios';

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

// Example external API call endpoint
router.get('/external-data', async (req: Request, res: Response<ExternalApiData | { error: string }>) => {
  try {
    const response: AxiosResponse<ExternalApiData> = await axios.get(
      'https://jsonplaceholder.typicode.com/posts/1'
    );
    res.json(response.data);
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