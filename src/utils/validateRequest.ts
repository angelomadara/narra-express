import { Response } from 'express';

interface ValidationError {
  type: string;          // e.g., "field"
  msg: string;           // error message
  path: string;          // which field failed
  location: string;      // e.g., "body"
  value?: string;        // optional (not always present)
}

interface ValidationErrorResponse {
  errors: ValidationError[];
}

export const validateRequest = (res: Response, errors: any) => {
  
  const groupedErrors = errors.reduce((acc: any, err: any) => {
    const param = err.path; // Use 'path' instead of 'param'
    if (!acc[param]) acc[param] = [];
    acc[param].push(err.msg);
    return acc;
  }, {} as Record<string, string[]>);

  const groupedErrorsArray = Object.entries(groupedErrors).map(
    ([key, messages]) => ({ [key]: messages })
  );

  res.status(400).json({
    // error: 'Validation failed',
    // message: 'Invalid input',
    errors: groupedErrorsArray
  });
  return;
}