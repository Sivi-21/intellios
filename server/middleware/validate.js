import { AppError } from './errorHandler.js';

export function requireBody(fields) {
  return (req, _res, next) => {
    const missing = fields.filter((f) => {
      const val = req.body?.[f];
      return val === undefined || val === null || (typeof val === 'string' && !val.trim());
    });

    if (missing.length) {
      return next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400, 'VALIDATION_ERROR'));
    }
    next();
  };
}
