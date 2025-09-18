import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

interface EarthquakeData {
  magnitude: number;
  place: string;
  time: number;
  coordinates: [number, number, number];
  url: string;
  tsunami: number;
}

interface USGSResponse {
  features: Array<{
    properties: {
      mag: number;
      place: string;
      time: number;
      url: string;
      tsunami: number;
    };
    geometry: {
      coordinates: [number, number, number];
    };
  }>;
}

class EarthquakeController {
  private readonly USGS_API_BASE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary';

  /**
   * Get recent earthquakes from the last 24 hours
   */
  async getRecentEarthquakes(req: Request, res: Response): Promise<void> {
    try {
      const response: AxiosResponse<USGSResponse> = await axios.get(
        `${this.USGS_API_BASE}/all_day.geojson`
      );

      const earthquakes: EarthquakeData[] = response.data.features.map(feature => ({
        magnitude: feature.properties.mag,
        place: feature.properties.place,
        time: feature.properties.time,
        coordinates: feature.geometry.coordinates,
        url: feature.properties.url,
        tsunami: feature.properties.tsunami
      }));

      res.json({
        message: 'Recent earthquakes data retrieved successfully',
        count: earthquakes.length,
        data: earthquakes.slice(0, 20) // Return first 20
      });
    } catch (error) {
      console.error('USGS API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch earthquake data',
        message: 'Unable to retrieve data from USGS service'
      });
    }
  }

  /**
   * Get earthquakes filtered by minimum magnitude
   */
  async getEarthquakesByMagnitude(req: Request, res: Response): Promise<void> {
    try {
      const minMagnitude = parseFloat(req.params.minMag);
      
      if (isNaN(minMagnitude) || minMagnitude < 0) {
        res.status(400).json({ 
          error: 'Invalid magnitude value',
          message: 'Magnitude must be a positive number'
        });
        return;
      }

      const response: AxiosResponse<USGSResponse> = await axios.get(
        `${this.USGS_API_BASE}/all_day.geojson`
      );

      const earthquakes: EarthquakeData[] = response.data.features
        .filter(feature => feature.properties.mag >= minMagnitude)
        .map(feature => ({
          magnitude: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          coordinates: feature.geometry.coordinates,
          url: feature.properties.url,
          tsunami: feature.properties.tsunami
        }))
        .sort((a, b) => b.magnitude - a.magnitude); // Sort by magnitude descending

      res.json({
        message: `Earthquakes with magnitude >= ${minMagnitude}`,
        minMagnitude,
        count: earthquakes.length,
        data: earthquakes
      });
    } catch (error) {
      console.error('USGS API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch earthquake data',
        message: 'Unable to retrieve data from USGS service'
      });
    }
  }

  /**
   * Get significant earthquakes from the past week
   */
  async getSignificantEarthquakes(req: Request, res: Response): Promise<void> {
    try {
      const response: AxiosResponse<USGSResponse> = await axios.get(
        `${this.USGS_API_BASE}/significant_week.geojson`
      );

      const earthquakes: EarthquakeData[] = response.data.features.map(feature => ({
        magnitude: feature.properties.mag,
        place: feature.properties.place,
        time: feature.properties.time,
        coordinates: feature.geometry.coordinates,
        url: feature.properties.url,
        tsunami: feature.properties.tsunami
      }));

      res.json({
        message: 'Significant earthquakes from the past week',
        count: earthquakes.length,
        data: earthquakes
      });
    } catch (error) {
      console.error('USGS API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch significant earthquake data',
        message: 'Unable to retrieve data from USGS service'
      });
    }
  }

  /**
   * Get earthquake statistics
   */
  async getEarthquakeStats(req: Request, res: Response): Promise<void> {
    try {
      const response: AxiosResponse<USGSResponse> = await axios.get(
        `${this.USGS_API_BASE}/all_day.geojson`
      );

      const earthquakes = response.data.features;
      const magnitudes = earthquakes.map(eq => eq.properties.mag).filter(mag => mag !== null);
      
      if (magnitudes.length === 0) {
        res.json({
          message: 'No earthquake data available for statistics',
          stats: null
        });
        return;
      }

      const stats = {
        total: earthquakes.length,
        maxMagnitude: Math.max(...magnitudes),
        minMagnitude: Math.min(...magnitudes),
        averageMagnitude: magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length,
        above5: magnitudes.filter(mag => mag >= 5.0).length,
        above4: magnitudes.filter(mag => mag >= 4.0).length,
        above3: magnitudes.filter(mag => mag >= 3.0).length,
        tsunamiWarnings: earthquakes.filter(eq => eq.properties.tsunami === 1).length
      };

      res.json({
        message: 'Earthquake statistics for the last 24 hours',
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('USGS API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch earthquake statistics',
        message: 'Unable to retrieve data from USGS service'
      });
    }
  }
}

export default new EarthquakeController();