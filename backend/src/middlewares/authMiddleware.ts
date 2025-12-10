import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService';
import { AppError } from './errorHandler';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'AUTH_TOKEN_MISSING', 'No authentication token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = authService.verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
};
