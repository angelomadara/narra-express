import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validateRequest } from '../utils/validateRequest';
import log from '../services/log.service';

/**
 * Base Controller class with common functionality for all controllers
 */
export abstract class BaseController {
  /**
   * Constructor that automatically binds methods to the instance
   */
  constructor() {
    this.bindMethods();
  }

  /**
   * Automatically bind all methods of the controller to the instance
   * This prevents 'this' context issues when passing methods as callbacks
   */
  private bindMethods(): void {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    
    propertyNames.forEach(name => {
      const property = (this as any)[name];
      
      // Only bind functions that are not the constructor or private methods
      if (typeof property === 'function' && name !== 'constructor' && !name.startsWith('_')) {
        (this as any)[name] = property.bind(this);
      }
    });
  }

  /**
   * Handle express-validator validation errors
   * @param req Request object
   * @param res Response object
   * @returns true if validation passed, false if failed
   */
  protected validateRequest(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      validateRequest(res, errors.array());
      return false;
    }
    return true;
  }

  /**
   * Validate and parse numeric ID from request parameters
   * @param req Request object
   * @param res Response object
   * @param paramName Parameter name (default: 'id')
   * @returns Parsed ID or null if invalid
   */
  protected validateId(req: Request, res: Response, paramName: string = 'id'): number | null {
    const id = parseInt(req.params[paramName]);
    
    if (isNaN(id)) {
      this.sendErrorResponse(res, 400, 'Invalid ID', `${paramName} must be a valid number`);
      return null;
    }
    
    return id;
  }

  /**
   * Send standardized success response
   * @param res Response object
   * @param status HTTP status code
   * @param message Success message
   * @param data Optional data payload
   * @param meta Optional metadata (pagination, etc.)
   */
  protected sendSuccessResponse(
    res: Response, 
    status: number = 200, 
    message: string, 
    data?: any, 
    meta?: any
  ): void {
    const response: any = { message };
    
    if (data !== undefined) {
      response.data = data;
    }
    
    if (meta) {
      Object.assign(response, meta);
    }
    
    res.status(status).json(response);
  }

  /**
   * Send standardized error response
   * @param res Response object
   * @param status HTTP status code
   * @param error Error type/title
   * @param message Detailed error message
   * @param details Optional error details
   */
  protected sendErrorResponse(
    res: Response, 
    status: number, 
    error: string, 
    message: string, 
    details?: any
  ): void {
    const response: any = { error, message };
    
    if (details) {
      response.details = details;
    }
    
    res.status(status).json(response);
  }

  /**
   * Handle async controller methods with standardized error handling
   * @param asyncFn Async function to wrap
   * @param req Request object
   * @param res Response object
   */
  protected async handleAsync(
    asyncFn: (req: Request, res: Response) => Promise<void>,
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      await asyncFn(req, res);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Centralized error handling
   * @param error Error object
   * @param res Response object
   * @param context Optional context for logging
   */
  protected handleError(error: unknown, res: Response, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log error for debugging
    log.error(`${context ? context + ' ' : ''}Error:`, error);
    
    // Handle specific error types
    if (error instanceof Error) {
      switch (error.message) {
        case 'Not found':
        case 'Earthquake not found':
        case 'User not found':
          this.sendErrorResponse(res, 404, 'Resource not found', errorMessage);
          return;
        
        case 'Unauthorized':
          this.sendErrorResponse(res, 401, 'Unauthorized', errorMessage);
          return;
        
        case 'Forbidden':
          this.sendErrorResponse(res, 403, 'Forbidden', errorMessage);
          return;
        
        case 'Validation failed':
          this.sendErrorResponse(res, 400, 'Validation error', errorMessage);
          return;
      }
    }
    
    // Default server error
    this.sendErrorResponse(res, 500, 'Internal server error', errorMessage);
  }

  /**
   * Create pagination metadata
   * @param page Current page number
   * @param limit Items per page
   * @param total Total number of items
   * @returns Pagination metadata object
   */
  protected createPagination(page: number, limit: number, total: number) {
    return {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  /**
   * Parse pagination parameters from query
   * @param req Request object
   * @param defaultLimit Default limit if not specified
   * @returns Parsed pagination parameters
   */
  protected parsePagination(req: Request, defaultLimit: number = 10) {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || defaultLimit));
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
  }

  /**
   * Validate required fields in request body
   * @param req Request object
   * @param res Response object
   * @param requiredFields Array of required field names
   * @returns true if all fields are present, false otherwise
   */
  protected validateRequiredFields(
    req: Request, 
    res: Response, 
    requiredFields: string[]
  ): boolean {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      this.sendErrorResponse(
        res, 
        400, 
        'Missing required fields', 
        `The following fields are required: ${missingFields.join(', ')}`
      );
      return false;
    }
    
    return true;
  }
}