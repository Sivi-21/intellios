import logger from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.path}`, {
      status: res.statusCode,
      durationMs: duration,
      sessionId: req.sessionId?.slice(0, 8),
    });
  });

  next();
}
