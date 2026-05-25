import groqService from '../../services/groqService.js';
import contextManager from '../../services/contextManager.js';

export async function generateComponent({ args, workspace, model }) {
  const spec = args.spec || 'A reusable UI component for IntelliOS dashboard';

  const envelope = contextManager.buildContextEnvelope(workspace);
  const prompt = `Generate a production-ready React + TypeScript component for IntelliOS.

Requirements:
- Tailwind CSS, dark zinc/cyan cyber aesthetic matching IntelliOS
- ${spec}
- Include proper types and export
- Return the full component in a single fenced tsx code block`;

  const messages = contextManager.buildMessages([], prompt, envelope);
  const result = await groqService.complete({ messages, model, temperature: 0.4 });

  return {
    summary: 'React component generated',
    message: { content: result.content, codeSnippet: result.codeSnippet },
    actions: [{ type: 'activity', title: 'Component synthesis complete' }],
  };
}
