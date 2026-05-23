import contextEngine from '../context/contextEngine.js';

export async function updateContext(req, res) {
  const { context, workspace } = req.body;

  const merged = await contextEngine.updateContext(req.sessionId, {
    ...context,
    recentAction: context?.recentAction,
  }, workspace || {});

  const envelope = contextEngine.buildContextEnvelope(workspace || {});

  res.json({
    success: true,
    sessionId: req.sessionId,
    context: merged,
    envelope,
  });
}

export async function getContext(req, res) {
  const session = await contextEngine.getSession(req.sessionId);
  res.json({
    success: true,
    sessionId: req.sessionId,
    context: session.context,
  });
}
