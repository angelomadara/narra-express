import { AppDataSource } from "../config/database";
import { User } from "../models/user.model";

export class UserService{
  private userRepository;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  async getAllUsers() {
    const users = await this.userRepository.find();

    const safeUsers = users.map(user => {
      const { password, refreshToken, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
      return safeUser;
    });
    
    return safeUsers;
  }
}