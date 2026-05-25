import { BaseAgent } from './baseAgent.js';
import RESEARCH_SYSTEM_PROMPT from './prompts/research.prompt.js';

export const researchAgent = new BaseAgent({
  id: 'research',
  name: 'Research Agent',
  description: 'Technical synthesis, briefs, and workspace documentation analysis.',
  capabilities: ['summarize', 'compare', 'document', 'brief'],
  systemPrompt: RESEARCH_SYSTEM_PROMPT,
});
