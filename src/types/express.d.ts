declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
      csrfToken?: string;
      session?: {
        csrfSecret?: string;
      };
      rateLimitHash?: string;
    }
  }
}

export {};