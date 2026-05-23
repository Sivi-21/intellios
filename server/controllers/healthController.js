import { isDatabaseReady } from '../config/database.js';
import { isGroqAvailable } from '../config/groq.js';
import groqService from '../services/groqService.js';

export function getHealth(req, res) {
  res.json({
    success: true,
    service: 'IntelliOS AI Core',
    version: '2.0.0',
    status: 'operational',
    phase: 3,
    subsystems: {
      groq: isGroqAvailable() ? 'online' : 'fallback',
      mongodb: isDatabaseReady() ? 'connected' : 'ephemeral',
      websocket: 'ready',
      commandEngine: 'ready',
      agentRegistry: 'ready',
      memoryEngine: 'ready',
      contextEngine: 'ready',
      agentRouter: 'ready',
      repositoryAnalyzer: 'ready',
      vectorMemory: 'stub',
    },
    sessionId: req.sessionId,
    defaultModel: groqService.resolveModel(),
    timestamp: new Date().toISOString(),
  });
}
