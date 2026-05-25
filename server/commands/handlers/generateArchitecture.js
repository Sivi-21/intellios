import groqService from '../../services/groqService.js';
import contextEngine from '../../context/contextEngine.js';

export async function generateArchitecture({ workspace, model }) {
  const envelope = contextEngine.buildContextEnvelope(workspace);

  const prompt = `Generate a system architecture document for the IntelliOS workspace.

Include:
- High-level component diagram (mermaid)
- Data flow between frontend, API, agents, memory, WebSocket
- Scalability considerations
- Security boundaries
- Phase roadmap suggestions

Context:
\`\`\`json
${JSON.stringify(envelope, null, 2)}
\`\`\``;

  const sessionId = workspace.sessionId || 'arch-gen';
  const { messages } = await contextEngine.buildInferenceContext(
    sessionId,
    workspace,
    prompt,
    []
  );

  const result = await groqService.complete({ messages, model, temperature: 0.5 });

  return {
    summary: 'Architecture document generated',
    message: { content: result.content, codeSnippet: result.codeSnippet },
    actions: [{ type: 'activity', title: 'Architecture blueprint synthesized' }],
  };
}
