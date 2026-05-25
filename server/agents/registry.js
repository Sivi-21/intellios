import { codingAgent } from './codingAgent.js';
import { researchAgent } from './researchAgent.js';
import { productivityAgent } from './productivityAgent.js';
import { debuggingAgent } from './debuggingAgent.js';

const AGENTS = new Map([
  [codingAgent.id, codingAgent],
  [researchAgent.id, researchAgent],
  [productivityAgent.id, productivityAgent],
  [debuggingAgent.id, debuggingAgent],
]);

const INTENT_AGENT_MAP = {
  generate_component: 'coding',
  explain_errors: 'debugging',
  summarize_notes: 'research',
  analyze_project: 'research',
  analyze_repository: 'research',
  generate_architecture: 'research',
  create_tasks: 'productivity',
  create_note: 'productivity',
  open_tasks: 'productivity',
};

export function getAgent(id) {
  return AGENTS.get(id);
}

export function listAgents() {
  return Array.from(AGENTS.values()).map((a) => a.getMeta());
}

export function resolveAgentForIntent(intent) {
  return INTENT_AGENT_MAP[intent] || 'coding';
}

export function getRegistry() {
  return AGENTS;
}

export default { getAgent, listAgents, resolveAgentForIntent, getRegistry };
