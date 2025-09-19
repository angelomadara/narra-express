export interface RegisterDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}