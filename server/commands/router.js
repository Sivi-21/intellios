import { summarizeNotes } from './handlers/summarizeNotes.js';
import { analyzeProject } from './handlers/analyzeProject.js';
import { generateComponent } from './handlers/generateComponent.js';
import { explainErrors } from './handlers/explainErrors.js';
import { searchWorkspace } from './handlers/searchWorkspace.js';
import { createTasks } from './handlers/createTasks.js';
import { createNote } from './handlers/createNote.js';
import { clearChat } from './handlers/clearChat.js';
import { systemStatus } from './handlers/systemStatus.js';
import { openTasks } from './handlers/openTasks.js';
import { generateArchitecture } from './handlers/generateArchitecture.js';
import { analyzeRepository } from './handlers/analyzeRepository.js';
import { AppError } from '../middleware/errorHandler.js';

const HANDLERS = {
  summarizeNotes,
  analyzeProject,
  generateComponent,
  explainErrors,
  searchWorkspace,
  createTasks,
  createNote,
  clearChat,
  systemStatus,
  openTasks,
  generateArchitecture,
  analyzeRepository,
};

export function getRegisteredCommands() {
  return Object.keys(HANDLERS).map((name) => ({
    handler: name,
    description: COMMAND_DESCRIPTIONS[name] || name,
  }));
}

const COMMAND_DESCRIPTIONS = {
  summarizeNotes: 'Digest all workspace notes into an executive summary',
  analyzeProject: 'Architectural analysis of current workspace state',
  generateComponent: 'Synthesize a React/TSX component',
  explainErrors: 'Debug and explain error output',
  searchWorkspace: 'Search notes and tasks index',
  createTasks: 'Create a new sprint objective',
  createNote: 'Spawn a new document blueprint',
  clearChat: 'Reset AI conversation thread',
  systemStatus: 'Run system telemetry scan',
  openTasks: 'List open sprint objectives',
  generateArchitecture: 'Generate system architecture document',
  analyzeRepository: 'Deep-scan repository structure and AI summary',
};

export async function executeCommand(handlerName, ctx) {
  const handler = HANDLERS[handlerName];
  if (!handler) {
    throw new AppError(`Unknown command handler: ${handlerName}`, 400, 'UNKNOWN_COMMAND');
  }
  return handler(ctx);
}
