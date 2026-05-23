import { BaseAgent } from './baseAgent.js';
import PRODUCTIVITY_SYSTEM_PROMPT from './prompts/productivity.prompt.js';

export const productivityAgent = new BaseAgent({
  id: 'productivity',
  name: 'Productivity Agent',
  description: 'Tasks, notes, sprint planning, and workflow optimization.',
  capabilities: ['plan_sprint', 'prioritize_tasks', 'organize_notes', 'workflow'],
  systemPrompt: PRODUCTIVITY_SYSTEM_PROMPT,
});
