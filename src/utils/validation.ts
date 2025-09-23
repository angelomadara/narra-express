import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class ValidationUtils {
  /**
   * Sanitize string input to prevent XSS and injection
   */
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 255); // Limit length
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate and transform DTO
   */
  static async validateDTO<T extends object>(
    dtoClass: new () => T,
    data: any
  ): Promise<T> {
    const dto = plainToClass(dtoClass, data);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    return dto;
  }
}