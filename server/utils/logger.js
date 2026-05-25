import env from '../config/env.js';

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = LEVELS[env.LOG_LEVEL] ?? LEVELS.info;

function format(level, message, meta) {
  const ts = new Date().toISOString();
  const base = `[${ts}] [IntelliOS:${level.toUpperCase()}] ${message}`;
  if (meta && Object.keys(meta).length) {
    return `${base} ${JSON.stringify(meta)}`;
  }
  return base;
}

const logger = {
  error: (msg, meta) => {
    if (currentLevel >= LEVELS.error) console.error(format('error', msg, meta));
  },
  warn: (msg, meta) => {
    if (currentLevel >= LEVELS.warn) console.warn(format('warn', msg, meta));
  },
  info: (msg, meta) => {
    if (currentLevel >= LEVELS.info) console.log(format('info', msg, meta));
  },
  debug: (msg, meta) => {
    if (currentLevel >= LEVELS.debug) console.log(format('debug', msg, meta));
  },
};

export default logger;
