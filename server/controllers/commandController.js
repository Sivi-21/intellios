import cognitiveOrchestrator from '../services/cognitiveOrchestrator.js';
import { getRegisteredCommands } from '../commands/router.js';
import { parseCommand } from '../services/commandParser.js';

export async function executeCommand(req, res) {
  const { input, workspace, model } = req.body;

  const result = await cognitiveOrchestrator.processCommand({
    sessionId: req.sessionId,
    input,
    workspace,
    model,
  });

  res.json({ success: true, sessionId: req.sessionId, ...result });
}

export async function parseIntent(req, res) {
  const { input } = req.body;
  const parsed = parseCommand(input);
  res.json({ success: true, parsed });
}

export async function listCommands(_req, res) {
  res.json({
    success: true,
    commands: getRegisteredCommands(),
    slashCommands: [
      '/summarize',
      '/analyze',
      '/component',
      '/debug',
      '/search',
      '/task',
      '/note',
      '/clear',
      '/status',
    ],
  });
}
