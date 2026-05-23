import { generateId } from '../utils/id.js';

const SESSION_HEADER = 'x-intellios-session';

/**
 * Binds or creates an IntelliOS session ID for context tracking.
 */
export function sessionContext(req, res, next) {
  const incoming = req.headers[SESSION_HEADER] || req.body?.sessionId;
  req.sessionId = incoming || generateId('session');
  res.setHeader(SESSION_HEADER, req.sessionId);
  next();
}
