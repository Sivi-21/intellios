import { BaseAgent } from './baseAgent.js';
import DEBUGGING_SYSTEM_PROMPT from './prompts/debugging.prompt.js';

export const debuggingAgent = new BaseAgent({
  id: 'debugging',
  name: 'Debug Agent',
  description: 'Error diagnosis, root-cause analysis, and fix guidance.',
  capabilities: ['explain_error', 'trace', 'fix_suggestion', 'prevent'],
  systemPrompt: DEBUGGING_SYSTEM_PROMPT,
});
