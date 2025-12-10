import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to sanitize user input and prevent XSS attacks
 */

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
];

function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    let sanitized = value;
    
    // Remove dangerous patterns
    DANGEROUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Encode HTML entities
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
    
    return sanitized;
  }
  
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  
  if (typeof value === 'object' && value !== null) {
    const sanitized: any = {};
    for (const key in value) {
      sanitized[key] = sanitizeValue(value[key]);
    }
    return sanitized;
  }
  
  return value;
}

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  
  next();
};
