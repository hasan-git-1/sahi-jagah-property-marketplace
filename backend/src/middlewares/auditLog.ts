import { Request, Response, NextFunction } from 'express';
import { db } from '../config/firebase';
import { logger } from '../config/logger';

/**
 * Middleware to log sensitive data access for audit purposes
 */

interface AuditLogEntry {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  details?: any;
}

const SENSITIVE_ACTIONS = [
  'user.delete',
  'user.suspend',
  'user.activate',
  'property.verify',
  'property.reject',
  'document.view',
  'admin.access',
];

export const auditLog = (action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return next();
    }

    // Only log sensitive actions
    if (!SENSITIVE_ACTIONS.includes(action)) {
      return next();
    }

    const logEntry: AuditLogEntry = {
      userId: user.id,
      action,
      resource: req.baseUrl + req.path,
      resourceId: req.params.id,
      ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
      userAgent: req.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      success: true,
    };

    // Store original send function
    const originalSend = res.send;

    // Override send to capture response status
    res.send = function (data: any) {
      logEntry.success = res.statusCode < 400;
      
      // Log to Firestore
      db.collection('auditLogs')
        .add(logEntry)
        .catch(error => {
          logger.error('Failed to write audit log:', error);
        });

      // Log to console
      logger.info('Audit log:', logEntry);

      // Call original send
      return originalSend.call(this, data);
    };

    next();
  };
};
