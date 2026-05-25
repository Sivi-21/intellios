import groqService from '../../services/groqService.js';
import contextManager from '../../services/contextManager.js';

export async function summarizeNotes({ workspace, model }) {
  const notes = workspace.notes || [];
  if (!notes.length) {
    return {
      summary: 'No notes in workspace',
      message: {
        content: 'Your document index is empty. Create notes via `/note [title]` or the Notes panel.',
      },
      actions: [],
    };
  }

  const notesDigest = notes
    .map((n, i) => `### ${i + 1}. ${n.title} (${n.category})\n${(n.content || '').slice(0, 500)}`)
    .join('\n\n');

  const envelope = contextManager.buildContextEnvelope(workspace);
  const messages = contextManager.buildMessages(
    [],
    `Summarize these workspace notes into a concise executive briefing with key themes and action items:\n\n${notesDigest}`,
    envelope
  );

  const result = await groqService.complete({ messages, model });

  return {
    summary: 'Notes summarized',
    message: { content: result.content, codeSnippet: result.codeSnippet },
    actions: [{ type: 'activity', title: 'Notes digest generated' }],
    data: { noteCount: notes.length },
  };
}
