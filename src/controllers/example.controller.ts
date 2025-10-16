import { Request, Response } from 'express';
import { EarthquakeService } from '../services/earthquake.service';
import { CreateEarthquakeDTO, UpdateEarthquakeDTO, EarthquakeQueryDTO } from '../dto/earthquake.dto';
import { BaseController } from './base.controller';

class ExampleController extends BaseController {
  private earthquakeService: EarthquakeService;

  constructor() {
    super(); // Call base controller constructor for method binding
    this.earthquakeService = new EarthquakeService();
  }

  /**
   * Create a new earthquake record
   */
  async createEarthquake(req: Request, res: Response): Promise<void> {
    try {
      const earthquakeData: CreateEarthquakeDTO = req.body;
      
      // Validate required fields
      if (!this.validateRequiredFields(req, res, ['magnitude', 'location', 'depth', 'date_time'])) {
        return;
      }

      const earthquake = await this.earthquakeService.createEarthquake(earthquakeData);
      
      this.sendSuccessResponse(res, 201, 'Earthquake record created successfully', earthquake);
    } catch (error) {
      this.handleError(error, res, 'Create earthquake');
    }
  }

  /**
   * Get all earthquakes with optional filtering
   */
  async getAllEarthquakes(req: Request, res: Response): Promise<void> {
    try {
      const query: EarthquakeQueryDTO = req.query;
      const { page, limit, offset } = this.parsePagination(req);

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

      const pagination = this.createPagination(page, limit, total);
      
      this.sendSuccessResponse(res, 200, 'Earthquakes retrieved successfully', earthquakes, pagination);
    } catch (error) {
      this.handleError(error, res, 'Get earthquakes');
    }
  }

  /**
   * Get earthquake by ID
   */
  async getEarthquakeById(req: Request, res: Response): Promise<void> {
    try {
      const id = this.validateId(req, res);
      if (id === null) return;

      const earthquake = await this.earthquakeService.getEarthquakeById(id);
      
      this.sendSuccessResponse(res, 200, 'Earthquake retrieved successfully', earthquake);
    } catch (error) {
      this.handleError(error, res, 'Get earthquake by ID');
    }
  }

  /**
   * Update earthquake by ID
   */
  async updateEarthquake(req: Request, res: Response): Promise<void> {
    try {
      const id = this.validateId(req, res);
      if (id === null) return;
      
      const updateData: UpdateEarthquakeDTO = req.body;

      const earthquake = await this.earthquakeService.updateEarthquake(id, updateData);
      
      this.sendSuccessResponse(res, 200, 'Earthquake updated successfully', earthquake);
    } catch (error) {
      this.handleError(error, res, 'Update earthquake');
    }
  }

  /**
   * Delete earthquake by ID
   */
  async deleteEarthquake(req: Request, res: Response): Promise<void> {
    try {
      const id = this.validateId(req, res);
      if (id === null) return;

      await this.earthquakeService.deleteEarthquake(id);
      
      this.sendSuccessResponse(res, 200, 'Earthquake deleted successfully');
    } catch (error) {
      this.handleError(error, res, 'Delete earthquake');
    }
  }

  /**
   * Get earthquake statistics
   */
  async getEarthquakeStats(req: Request, res: Response): Promise<void> {
    try {
      const earthquakes = await this.earthquakeService.getAllEarthquakes();
      
      if (earthquakes.length === 0) {
        this.sendSuccessResponse(res, 200, 'No earthquake data available', null);
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

      this.sendSuccessResponse(
        res, 
        200, 
        'Earthquake statistics retrieved successfully', 
        stats, 
        { timestamp: new Date().toISOString() }
      );
    } catch (error) {
      this.handleError(error, res, 'Get earthquake stats');
    }
  }
}

export default new ExampleController();