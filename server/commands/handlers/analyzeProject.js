import groqService from '../../services/groqService.js';
import contextManager from '../../services/contextManager.js';

export async function analyzeProject({ workspace, model }) {
  const envelope = contextManager.buildContextEnvelope(workspace);

  const projectBrief = `
Analyze this IntelliOS developer workspace as a senior architect:
- Active page: ${envelope.activePage}
- Notes: ${envelope.stats.noteCount}
- Tasks: ${envelope.stats.taskCount} (${envelope.stats.openTasks} open)
- Recent activity: ${JSON.stringify(envelope.recentActivities)}

Provide: architecture assessment, risk areas, recommended next steps, and AI pipeline opportunities.
`;

  const messages = contextManager.buildMessages([], projectBrief, envelope);
  const result = await groqService.complete({ messages, model });

  return {
    summary: 'Project analysis complete',
    message: { content: result.content, codeSnippet: result.codeSnippet },
    actions: [{ type: 'activity', title: 'Workspace analysis executed' }],
  };
}
