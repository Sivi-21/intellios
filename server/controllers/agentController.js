import agentOrchestrator from '../agents/orchestrator.js';

export async function listAgents(_req, res) {
  res.json({ success: true, agents: agentOrchestrator.list() });
}

export async function runAgent(req, res) {
  const { agentId, task, workspace, model } = req.body;

  const result = await agentOrchestrator.run(agentId, {
    sessionId: req.sessionId,
    task,
    workspace,
    model,
  });

  res.json({ success: true, sessionId: req.sessionId, ...result });
}
