import logger from '../utils/logger.js';

/**
 * Intelligent Agent Router — NLP + keyword scoring for multi-agent dispatch.
 */
const ROUTING_RULES = [
  {
    agentId: 'debugging',
    weight: 1,
    patterns: [
      /\b(bug|bugs|error|errors|exception|crash|failing|broken|stack\s*trace|debug|fix\s+this)\b/i,
      /explain\s+(this\s+)?error/i,
    ],
  },
  {
    agentId: 'coding',
    weight: 1,
    patterns: [
      /\b(react|tsx|typescript|javascript|component|hook|api|function|class|refactor|implement|code)\b/i,
      /generate\s+(a\s+)?(react|component|hook)/i,
    ],
  },
  {
    agentId: 'productivity',
    weight: 0.9,
    patterns: [
      /\b(task|tasks|sprint|todo|workflow|organize|priorit|schedule|objective|productivity)\b/i,
      /\/task\b/i,
      /open\s+tasks/i,
    ],
  },
  {
    agentId: 'research',
    weight: 0.9,
    patterns: [
      /\b(research|analyze|analysis|architecture|summarize|summary|compare|document|brief|report)\b/i,
      /\/summarize\b/i,
      /\/analyze\b/i,
    ],
  },
];

const PAGE_AGENT_BIAS = {
  chat: { coding: 0.3, debugging: 0.2 },
  tasks: { productivity: 0.5 },
  notes: { research: 0.5 },
  settings: { research: 0.2 },
};

export function routeToAgent(input, workspace = {}) {
  const text = (input || '').trim();
  const scores = { coding: 0.1, research: 0.1, productivity: 0.1, debugging: 0.1 };

  for (const rule of ROUTING_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        scores[rule.agentId] = (scores[rule.agentId] || 0) + rule.weight;
      }
    }
  }

  const page = workspace.activePage || 'dashboard';
  const bias = PAGE_AGENT_BIAS[page] || {};
  for (const [agentId, boost] of Object.entries(bias)) {
    scores[agentId] = (scores[agentId] || 0) + boost;
  }

  const awarenessHints = workspace.awareness?.suggestedAgentHints || [];
  for (const hint of awarenessHints) {
    scores[hint] = (scores[hint] || 0) + 0.25;
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [agentId, confidence] = ranked[0];

  const result = {
    agentId,
    confidence: Math.min(confidence / 2, 1),
    scores,
    reason: buildReason(agentId, text),
  };

  logger.debug('Agent routed', { agentId, confidence: result.confidence });
  return result;
}

function buildReason(agentId, text) {
  const snippet = text.slice(0, 60);
  return `Routed to ${agentId} based on prompt signals: "${snippet}${text.length > 60 ? '...' : ''}"`;
}

export function shouldUseAgentRoute(parsed, route) {
  if (parsed?.intent && parsed.intent !== 'chat' && parsed.confidence >= 0.8) return false;
  return route.confidence >= 0.35;
}

export default { routeToAgent, shouldUseAgentRoute };
