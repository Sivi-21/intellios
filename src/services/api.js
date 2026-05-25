const API_BASE = import.meta.env.VITE_API_URL || "/api";
const SESSION_KEY = "intellios_session_id";
export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session-${crypto.randomUUID().slice(0, 12)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}
export async function apiRequest(path, options = {}) {
  const sessionId = getSessionId();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "x-intellios-session": sessionId,
      ...options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {},
      ...options.headers || {}
    }
  });
  const newSession = res.headers.get("x-intellios-session");
  if (newSession) localStorage.setItem(SESSION_KEY, newSession);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || `API error ${res.status}`);
  }
  return data;
}
export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3e3) });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}
export default { apiRequest, getSessionId, checkHealth, API_BASE };
