const API_BASE = import.meta.env.VITE_API_URL || '/api';
const SESSION_KEY = 'intellios_session_id';

export interface WorkspaceSnapshot {
  activePage?: string;
  activeProject?: string;
  openWorkspace?: string;
  selectedNote?: { id: string; title: string } | null;
  selectedTask?: { id: string; title: string } | null;
  notes?: unknown[];
  tasks?: unknown[];
  recentActivities?: unknown[];
  userProfile?: unknown;
  model?: string;
}

export interface ChatResponse {
  success: boolean;
  sessionId: string;
  mode: string;
  message?: {
    id?: string;
    role: string;
    content: string;
    codeSnippet?: {
      code: string;
      language: string;
      filePath?: string;
    };
  };
  mutations?: {
    notes?: Array<{ title: string; content: string; category: string }>;
    tasks?: Array<{
      title: string;
      description: string;
      priority: string;
      status: string;
      category: string;
    }>;
  };
  clearChat?: boolean;
  intent?: string;
}

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `session-${crypto.randomUUID().slice(0, 12)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const sessionId = getSessionId();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-intellios-session': sessionId,
      ...(options.headers as Record<string, string>),
    },
  });

  const newSession = res.headers.get('x-intellios-session');
  if (newSession) localStorage.setItem(SESSION_KEY, newSession);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || 'IntelliOS API request failed');
  }
  return data as T;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

export function getActivePageFromHash(): string {
  const hash = window.location.hash.replace('#', '') || '/';
  const path = hash.startsWith('/') ? hash : `/${hash}`;
  if (path === '/' || path === '') return 'dashboard';
  return path.replace(/^\//, '').split('/')[0] || 'dashboard';
}

export async function sendChatMessage(
  message: string,
  workspace: WorkspaceSnapshot
): Promise<ChatResponse> {
  return request<ChatResponse>('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, workspace, model: workspace.model }),
  });
}

export async function executeCommand(
  input: string,
  workspace: WorkspaceSnapshot
): Promise<ChatResponse> {
  return request<ChatResponse>('/commands/execute', {
    method: 'POST',
    body: JSON.stringify({ input, workspace, model: workspace.model }),
  });
}

export async function updateSessionContext(
  workspace: WorkspaceSnapshot,
  context?: Record<string, unknown>
) {
  return request('/context', {
    method: 'PATCH',
    body: JSON.stringify({ workspace, context }),
  });
}

export async function clearServerChat() {
  return request('/chat/history', { method: 'DELETE' });
}

export { getSessionId };
