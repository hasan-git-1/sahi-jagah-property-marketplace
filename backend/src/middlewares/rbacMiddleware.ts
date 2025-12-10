import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

type Role = 'owner' | 'client' | 'agent' | 'admin';

export const rbacMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, 'AUTH_TOKEN_MISSING', 'Authentication required');
      }

      if (!allowedRoles.includes(req.user.role as Role)) {
        throw new AppError(
          403,
          'FORBIDDEN_ROLE',
          `Access denied. Required roles: ${allowedRoles.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
