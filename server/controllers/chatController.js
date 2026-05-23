import cognitiveOrchestrator from '../services/cognitiveOrchestrator.js';
import sessionService from '../services/sessionService.js';

export async function sendMessage(req, res) {
  const { message, workspace, model, stream } = req.body;

  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const result = await cognitiveOrchestrator.processChat({
      sessionId: req.sessionId,
      message,
      workspace,
      model,
      stream: true,
      onToken: (token) => {
        res.write(`data: ${JSON.stringify({ type: 'token', token })}\n\n`);
      },
    });

    res.write(`data: ${JSON.stringify({ type: 'done', result })}\n\n`);
    res.end();
    return;
  }

  const result = await cognitiveOrchestrator.processChat({
    sessionId: req.sessionId,
    message,
    workspace,
    model,
  });

  res.json({ success: true, sessionId: req.sessionId, ...result });
}

export async function getHistory(req, res) {
  const conversation = await sessionService.getConversation(req.sessionId);
  res.json({
    success: true,
    sessionId: req.sessionId,
    messages: conversation?.messages || [],
  });
}

export async function clearHistory(req, res) {
  await sessionService.clearConversation(req.sessionId);
  res.json({ success: true, sessionId: req.sessionId, cleared: true });
}
