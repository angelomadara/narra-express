// DTO for creating a new user
export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

// DTO for updating user (all fields optional)
export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  isActive?: boolean;
}

// DTO for user response (without password)
export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}