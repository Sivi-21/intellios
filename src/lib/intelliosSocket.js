import { getSessionId } from "./intelliosApi";
const WS_URL = import.meta.env.VITE_WS_URL || `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`;
export class IntelliOSSocket {
  ws = null;
  handlers = {};
  reconnectTimer = null;
  connect(handlers) {
    this.handlers = handlers;
    const sessionId = getSessionId();
    const url = `${WS_URL}?sessionId=${encodeURIComponent(sessionId)}`;
    try {
      this.ws = new WebSocket(url);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "chat.token":
            this.handlers.onToken?.(data.payload.token);
            break;
          case "typing":
            this.handlers.onTyping?.(data.payload.active);
            break;
          case "chat.complete":
            this.handlers.onComplete?.(data.payload);
            break;
          case "chat.error":
            this.handlers.onChatError?.(data.payload.message);
            break;
          case "error":
            this.handlers.onError?.(data.payload.message);
            this.handlers.onChatError?.(data.payload.message);
            break;
        }
      };
      this.ws.onclose = () => {
        this.reconnectTimer = setTimeout(() => this.connect(handlers), 5e3);
      };
    } catch {
      this.handlers.onError?.("WebSocket unavailable");
    }
  }
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
  streamChat(message, workspace) {
    if (!this.isConnected()) return false;
    this.ws?.send(
      JSON.stringify({
        type: "chat.stream",
        sessionId: getSessionId(),
        payload: { message, workspace, model: workspace.model }
      })
    );
    return true;
  }
  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }
}
export const intelliosSocket = new IntelliOSSocket();
