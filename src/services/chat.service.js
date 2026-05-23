import { apiRequest } from './api.js';

export async function sendMessage(message, workspace, { stream = false } = {}) {
  return apiRequest('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, workspace, model: workspace?.model, stream }),
  });
}

export async function getHistory() {
  return apiRequest('/chat/history');
}

export async function clearHistory() {
  return apiRequest('/chat/history', { method: 'DELETE' });
}

export default { sendMessage, getHistory, clearHistory };
