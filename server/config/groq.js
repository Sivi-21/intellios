import Groq from 'groq-sdk';
import env, { isGroqKeyConfigured } from './env.js';

let client = null;

export function getGroqClient() {
  if (!isGroqKeyConfigured()) return null;
  if (!client) {
    client = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return client;
}

export function isGroqAvailable() {
  return isGroqKeyConfigured();
}

export const GROQ_DEFAULTS = {
  model: env.GROQ_MODEL,
  fastModel: env.GROQ_FAST_MODEL,
  temperature: 0.6,
  maxTokens: 4096,
};
