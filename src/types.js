export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  category: string;
  isFavorite?: boolean;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'backlog';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeSnippet?: {
    code: string;
    language: string;
    filePath?: string;
  };
}

export interface RecentActivity {
  id: string;
  type: 'chat' | 'task' | 'note' | 'system';
  title: string;
  description: string;
  timestamp: string;
  meta?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: ProjectFile[];
  content?: string;
  language?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  openaiKeyPreset: boolean;
  geminiModel: string;
  theme: 'dark' | 'glass-cyan' | 'cyberpunk';
  autoSave: boolean;
}
