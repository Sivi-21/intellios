import { BaseAgent } from './baseAgent.js';
import CODING_SYSTEM_PROMPT from './prompts/coding.prompt.js';

export const codingAgent = new BaseAgent({
  id: 'coding',
  name: 'Coding Agent',
  description: 'TypeScript, React, Rust/WASM, and full-stack implementation.',
  capabilities: ['generate_code', 'refactor', 'explain_code', 'scaffold_component'],
  systemPrompt: CODING_SYSTEM_PROMPT,
});
