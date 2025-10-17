import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import log from '../services/log.service';

class ExampleController extends BaseController {
  
  constructor() {
    super(); // Call base controller constructor for method binding 
  }
  
  async createExample(req: Request, res: Response): Promise<void> {
    try {
      this.sendSuccessResponse(res, 200, 'Create example not implemented yet.');
    } catch (error) {
      this.handleError(error, res, 'Create example');
    }
  }

  async updateExample(req: Request, res: Response): Promise<void> {
    try {
      this.sendSuccessResponse(res, 200, 'Update example not implemented yet.');
    } catch (error) {
      this.handleError(error, res, 'Update example');
    }
  }

  async deleteExample(req: Request, res: Response): Promise<void> {
    try {
      this.sendSuccessResponse(res, 200,  'Delete example not implemented yet.');
    } catch (error) {
      this.handleError(error, res, 'Delete example');
    }
  }

  /**
   * logging test
   */
  async getTestLogging(req: Request, res: Response): Promise<void> {
    try {
      // Log messages at various levels
      log.debug('This is a debug message', { test: 'debug' });
      log.info('This is an info message', { test: 'info' });
      log.warn('This is a warning message', { test: 'warn' });
      log.error('This is an error message', { test: 'error' });
      log.transaction('This is a transaction message', { test: 'transaction' });
      log.trace('This is a trace message', { test: 'trace' });
      log.fatal('This is a fatal message', { test: 'fatal' });
      
      this.sendSuccessResponse(res, 200, 'Logging test completed. Check logs for details.');
    } catch (error) {
      this.handleError(error, res, 'Logging test');
    }
  }
}

export default new ExampleController();