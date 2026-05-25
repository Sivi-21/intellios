import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/intellios',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  GROQ_FAST_MODEL: process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant',
  SESSION_SECRET: process.env.SESSION_SECRET || 'intellios-dev-secret-change-in-prod',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  ENABLE_MEMORY: process.env.ENABLE_MEMORY === 'true',
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'server/uploads',
  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB || '50', 10),
};

const PLACEHOLDER_KEYS = new Set([
  '',
  'your_groq_api_key_here',
  'gsk_your_key_here',
  'MY_GROQ_API_KEY',
]);

export function isGroqKeyConfigured() {
  const key = (env.GROQ_API_KEY || '').trim();
  return key.length > 10 && !PLACEHOLDER_KEYS.has(key);
}

export function validateEnv() {
  const warnings = [];
  if (!isGroqKeyConfigured()) {
    warnings.push('GROQ_API_KEY is not set — AI endpoints will return structured fallbacks.');
  }
  return warnings;
}

export default env;
