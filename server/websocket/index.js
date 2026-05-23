import { WebSocketServer } from 'ws';
import logger from '../utils/logger.js';
import { registerClient, unregisterClient, getClientSession } from './eventBus.js';
import { handleChatStream, handleCommandExecute } from './handlers/messageHandlers.js';

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', 'http://localhost');
    const sessionId = url.searchParams.get('sessionId') || 'anonymous';

    registerClient(ws, sessionId);
    logger.info('WebSocket client connected', { sessionId: sessionId.slice(0, 8) });

    ws.send(
      JSON.stringify({
        type: 'connected',
        payload: { sessionId, phase: 3, message: 'IntelliOS neural link established' },
      })
    );

    ws.on('message', async (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        const sid = data.sessionId || getClientSession(ws) || sessionId;
        await dispatch(ws, sid, data);
      } catch (err) {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'typing', payload: { active: false } }));
          ws.send(JSON.stringify({ type: 'chat.error', payload: { message: err.message } }));
        }
      }
    });

    ws.on('close', () => unregisterClient(ws));
  });

  return wss;
}

async function dispatch(ws, sessionId, data) {
  switch (data.type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong', payload: { ts: Date.now() } }));
      break;
    case 'chat.stream':
      await handleChatStream(ws, sessionId, data.payload);
      break;
    case 'command.execute':
      await handleCommandExecute(ws, sessionId, data.payload);
      break;
    case 'notification.subscribe':
      ws.send(JSON.stringify({ type: 'notification.ack', payload: { subscribed: true } }));
      break;
    default:
      ws.send(JSON.stringify({ type: 'error', payload: { message: `Unknown event: ${data.type}` } }));
  }
}

export { broadcast, broadcastAll, getConnectionCount } from './eventBus.js';
