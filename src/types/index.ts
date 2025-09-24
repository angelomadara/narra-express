// Custom Request interface that extends Express Request
export interface CustomRequest extends Express.Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
  csrfToken?: string;
  session?: {
    csrfSecret?: string;
  };
  rateLimitHash?: string;
}
// Type declaration for xss-clean (no @types available)
declare module 'xss-clean';