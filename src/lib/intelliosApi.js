const API_BASE = import.meta.env.VITE_API_URL || "/api";
const SESSION_KEY = "intellios_session_id";
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session-${crypto.randomUUID().slice(0, 12)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
async function request(path, options = {}) {
  const sessionId = getSessionId();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-intellios-session": sessionId,
      ...options.headers
    }
  });
  const newSession = res.headers.get("x-intellios-session");
  if (newSession) localStorage.setItem(SESSION_KEY, newSession);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "IntelliOS API request failed");
  }
  return data;
}
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3e3) });
    return res.ok;
  } catch {
    return false;
  }
}
export function getActivePageFromHash() {
  const hash = window.location.hash.replace("#", "") || "/";
  const path = hash.startsWith("/") ? hash : `/${hash}`;
  if (path === "/" || path === "") return "dashboard";
  return path.replace(/^\//, "").split("/")[0] || "dashboard";
}
export async function sendChatMessage(message, workspace) {
  return request("/chat/message", {
    method: "POST",
    body: JSON.stringify({ message, workspace, model: workspace.model })
  });
}
export async function executeCommand(input, workspace) {
  return request("/commands/execute", {
    method: "POST",
    body: JSON.stringify({ input, workspace, model: workspace.model })
  });
}
export async function updateSessionContext(workspace, context) {
  return request("/context", {
    method: "PATCH",
    body: JSON.stringify({ workspace, context })
  });
}
export async function clearServerChat() {
  return request("/chat/history", { method: "DELETE" });
}
export { getSessionId };
