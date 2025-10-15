import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { UserService } from '../services/user.service';

class UserController extends BaseController {
  private userService: UserService; // Assume userService is defined elsewhere

  constructor() {
    super(); // Call base controller constructor for method binding
    this.userService = new UserService();
  }

  /**
   * Get all users
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      const paginate = this.createPagination(10, users.length, users.length);
      this.sendSuccessResponse(res, 200, 'Users retrieved successfully', paginate, users);
    } catch (error) {
      this.handleError(error, res, 'Get users');
    }
  }
}

export default new UserController();