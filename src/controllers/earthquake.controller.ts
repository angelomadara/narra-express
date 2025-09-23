import { Request, Response } from 'express';
import { EarthquakeService } from '../services/earthquake.service';
import { CreateEarthquakeDTO, UpdateEarthquakeDTO, EarthquakeQueryDTO } from '../dto/earthquake.dto';

class EarthquakeController {
  private earthquakeService: EarthquakeService;

  constructor() {
    this.earthquakeService = new EarthquakeService();

    // Bind all methods in constructor
    this.createEarthquake = this.createEarthquake.bind(this);
    this.getAllEarthquakes = this.getAllEarthquakes.bind(this);
    this.getEarthquakeById = this.getEarthquakeById.bind(this);
    this.updateEarthquake = this.updateEarthquake.bind(this);
    this.deleteEarthquake = this.deleteEarthquake.bind(this);
    this.getEarthquakeStats = this.getEarthquakeStats.bind(this)
    // ... bind all methods
  }

  /**
   * Create a new earthquake record
   */
  async createEarthquake(req: Request, res: Response): Promise<void> {
    try {
      const earthquakeData: CreateEarthquakeDTO = req.body;
      
      // Basic validation
      if (!earthquakeData.magnitude || !earthquakeData.location || !earthquakeData.depth || !earthquakeData.date_time) {
        res.status(400).json({
          error: 'Missing required fields',
          message: 'magnitude, location, depth, and date_time are required'
        });
        return;
      }

      const earthquake = await this.earthquakeService.createEarthquake(earthquakeData);
      
      res.status(201).json({
        message: 'Earthquake record created successfully',
        data: earthquake
      });
    } catch (error) {
      console.error('Create earthquake error:', error);
      res.status(500).json({
        error: 'Failed to create earthquake record',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all earthquakes with optional filtering
   */
  async getAllEarthquakes(req: Request, res: Response): Promise<void> {
    try {
      const query: EarthquakeQueryDTO = req.query;
      const page = parseInt(query.page || '1');
      const limit = parseInt(query.limit || '10');
      const offset = (page - 1) * limit;

      const filters = {
        minMagnitude: query.minMagnitude ? parseFloat(query.minMagnitude) : undefined,
        maxMagnitude: query.maxMagnitude ? parseFloat(query.maxMagnitude) : undefined,
        location: query.location,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        limit,
        offset
      };

      const [earthquakes, total] = await Promise.all([
        this.earthquakeService.getAllEarthquakes(filters),
        this.earthquakeService.getEarthquakeCount(filters)
      ]);

      res.json({
        message: 'Earthquakes retrieved successfully',
        data: earthquakes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get earthquakes error:', error);
      res.status(500).json({
        error: 'Failed to retrieve earthquakes',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get earthquake by ID
   */
  async getEarthquakeById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid ID',
          message: 'ID must be a valid number'
        });
        return;
      }

      const earthquake = await this.earthquakeService.getEarthquakeById(id);
      
      res.json({
        message: 'Earthquake retrieved successfully',
        data: earthquake
      });
    } catch (error) {
      console.error('Get earthquake by ID error:', error);
      
      if (error instanceof Error && error.message === 'Earthquake not found') {
        res.status(404).json({
          error: 'Earthquake not found',
          message: `No earthquake found with ID ${req.params.id}`
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to retrieve earthquake',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update earthquake by ID
   */
  async updateEarthquake(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const updateData: UpdateEarthquakeDTO = req.body;
      
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid ID',
          message: 'ID must be a valid number'
        });
        return;
      }

      const earthquake = await this.earthquakeService.updateEarthquake(id, updateData);
      
      res.json({
        message: 'Earthquake updated successfully',
        data: earthquake
      });
    } catch (error) {
      console.error('Update earthquake error:', error);
      
      if (error instanceof Error && error.message === 'Earthquake not found') {
        res.status(404).json({
          error: 'Earthquake not found',
          message: `No earthquake found with ID ${req.params.id}`
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to update earthquake',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Delete earthquake by ID
   */
  async deleteEarthquake(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid ID',
          message: 'ID must be a valid number'
        });
        return;
      }

      await this.earthquakeService.deleteEarthquake(id);
      
      res.json({
        message: 'Earthquake deleted successfully'
      });
    } catch (error) {
      console.error('Delete earthquake error:', error);
      
      if (error instanceof Error && error.message === 'Earthquake not found') {
        res.status(404).json({
          error: 'Earthquake not found',
          message: `No earthquake found with ID ${req.params.id}`
        });
        return;
      }

      res.status(500).json({
        error: 'Failed to delete earthquake',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get earthquake statistics
   */
  async getEarthquakeStats(req: Request, res: Response): Promise<void> {
    try {
      const earthquakes = await this.earthquakeService.getAllEarthquakes();
      
      if (earthquakes.length === 0) {
        res.json({
          message: 'No earthquake data available',
          stats: null
        });
        return;
      }

      const magnitudes = earthquakes.map(eq => eq.magnitude);
      const stats = {
        total: earthquakes.length,
        maxMagnitude: Math.max(...magnitudes),
        minMagnitude: Math.min(...magnitudes),
        averageMagnitude: magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length,
        above5: magnitudes.filter(mag => mag >= 5.0).length,
        above4: magnitudes.filter(mag => mag >= 4.0).length,
        above3: magnitudes.filter(mag => mag >= 3.0).length,
        recentCount: earthquakes.filter(eq => {
          const dayAgo = new Date();
          dayAgo.setDate(dayAgo.getDate() - 1);
          return new Date(eq.date_time) > dayAgo;
        }).length
      };

      res.json({
        message: 'Earthquake statistics retrieved successfully',
        stats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Get earthquake stats error:', error);
      res.status(500).json({
        error: 'Failed to retrieve earthquake statistics',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new EarthquakeController();