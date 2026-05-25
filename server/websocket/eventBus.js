const clients = new Map();

export function registerClient(ws, sessionId) {
  clients.set(ws, { sessionId, connectedAt: Date.now() });
}

export function unregisterClient(ws) {
  clients.delete(ws);
}

export function getClientSession(ws) {
  return clients.get(ws)?.sessionId;
}

export function broadcast(sessionId, event) {
  const payload = JSON.stringify(event);
  for (const [ws, meta] of clients.entries()) {
    if (meta.sessionId === sessionId && ws.readyState === 1) {
      ws.send(payload);
    }
  }
}

export function broadcastAll(event) {
  const payload = JSON.stringify(event);
  for (const [ws] of clients.entries()) {
    if (ws.readyState === 1) ws.send(payload);
  }
}

export function getConnectionCount() {
  return clients.size;
}
