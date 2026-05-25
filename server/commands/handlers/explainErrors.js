import groqService from '../../services/groqService.js';
import contextManager from '../../services/contextManager.js';

export async function explainErrors({ args, workspace, model }) {
  const errorContext = args.errorContext || args.query || 'No error text provided';

  const envelope = contextManager.buildContextEnvelope(workspace);
  const prompt = `As IntelliOS Debugging Agent, analyze this error and provide:
1. Root cause hypothesis
2. Step-by-step fix
3. Prevention tips

Error context:
\`\`\`
${errorContext}
\`\`\``;

  const messages = contextManager.buildMessages([], prompt, envelope);
  const result = await groqService.complete({ messages, model, temperature: 0.3 });

  return {
    summary: 'Error analysis delivered',
    message: { content: result.content, codeSnippet: result.codeSnippet },
    agent: 'debugging',
  };
}
