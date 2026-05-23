import cognitiveOrchestrator from '../../services/cognitiveOrchestrator.js';

export async function handleChatStream(ws, sessionId, payload) {
  const { message, workspace, model } = payload || {};

  ws.send(JSON.stringify({ type: 'typing', payload: { active: true } }));

  try {
    const result = await cognitiveOrchestrator.processChat({
      sessionId,
      message,
      workspace,
      model,
      stream: true,
      onToken: (token) => {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({ type: 'chat.token', payload: { token } }));
        }
      },
    });

    ws.send(JSON.stringify({ type: 'chat.complete', payload: result }));
  } catch (err) {
    ws.send(JSON.stringify({ type: 'chat.error', payload: { message: err.message } }));
  } finally {
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({ type: 'typing', payload: { active: false } }));
    }
  }
}

export async function handleCommandExecute(ws, sessionId, payload) {
  const { input, workspace, model } = payload || {};

  ws.send(JSON.stringify({ type: 'command.status', payload: { status: 'running' } }));

  try {
    const result = await cognitiveOrchestrator.processCommand({
      sessionId,
      input,
      workspace,
      model,
    });
    ws.send(JSON.stringify({ type: 'command.result', payload: result }));
  } catch (err) {
    ws.send(JSON.stringify({ type: 'command.status', payload: { status: 'failed', error: err.message } }));
  }
}
