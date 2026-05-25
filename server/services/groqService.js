import { getGroqClient, isGroqAvailable, GROQ_DEFAULTS } from '../config/groq.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import { getPrimaryCodeSnippet } from '../utils/codeParser.js';

export class GroqService {
  resolveModel(requested) {
    const map = {
      'gemini-2.5-pro': GROQ_DEFAULTS.model,
      'gemini-2.5-flash': GROQ_DEFAULTS.fastModel,
      'gemini-1.5-pro': GROQ_DEFAULTS.model,
      'llama-3.3-70b-versatile': GROQ_DEFAULTS.model,
      'llama-3.1-8b-instant': GROQ_DEFAULTS.fastModel,
    };
    return map[requested] || requested || GROQ_DEFAULTS.model;
  }

  async complete({ messages, model, temperature, maxTokens }) {
    const client = getGroqClient();
    if (!client) {
      return this.fallbackComplete(messages);
    }

    const resolvedModel = this.resolveModel(model);

    const completion = await client.chat.completions.create({
      model: resolvedModel,
      messages,
      temperature: temperature ?? GROQ_DEFAULTS.temperature,
      max_tokens: maxTokens ?? GROQ_DEFAULTS.maxTokens,
    });

    const content = completion.choices[0]?.message?.content || '';
    return {
      content,
      model: resolvedModel,
      codeSnippet: getPrimaryCodeSnippet(content),
      usage: completion.usage,
    };
  }

  async *stream({ messages, model, temperature, maxTokens }) {
    const client = getGroqClient();
    if (!client) {
      const fallback = await this.fallbackComplete(messages);
      yield { type: 'token', content: fallback.content };
      yield { type: 'done', ...fallback };
      return;
    }

    const resolvedModel = this.resolveModel(model);

    const stream = await client.chat.completions.create({
      model: resolvedModel,
      messages,
      temperature: temperature ?? GROQ_DEFAULTS.temperature,
      max_tokens: maxTokens ?? GROQ_DEFAULTS.maxTokens,
      stream: true,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        yield { type: 'token', content: delta };
      }
    }

    yield {
      type: 'done',
      content: fullContent,
      model: resolvedModel,
      codeSnippet: getPrimaryCodeSnippet(fullContent),
    };
  }

  async fallbackComplete(messages) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const query = (lastUser?.content || 'Hello').toLowerCase();

    logger.warn('Groq unavailable — using IntelliOS fallback inference');

    if (/about\s+(the\s+)?app|what\s+is\s+intellios|tell\s+me\s+about/.test(query)) {
      return {
        content: `**IntelliOS** is an AI-powered operating system shell for developers and students.

**What you have running**
- **Cockpit dashboard** — workspace overview, widgets, neural maps
- **AI Chat** — context-aware copilot (needs Groq API key for full inference)
- **Notes & Tasks** — document index and sprint board
- **Command palette** (\`Ctrl+K\`) — \`/note\`, \`/task\`, \`/analyze\`, \`/summarize\`, and more
- **AI Core backend** — Express + Groq + WebSockets + command engine + agents

**Enable real AI**
1. Get a free key at https://console.groq.com/keys
2. Open \`.env\` in the project folder
3. Set \`GROQ_API_KEY=gsk_...\` (your real key)
4. Restart the server: \`npm run dev:server\`

Then chat will use your notes, tasks, and active page as context.`,
        model: 'fallback',
        codeSnippet: null,
        usage: null,
      };
    }

    return {
      content: `**IntelliOS Core** (offline inference mode)

\`GROQ_API_KEY\` is not configured in \`.env\`. Get a free key at https://console.groq.com/keys then set:

\`GROQ_API_KEY=gsk_your_actual_key\`

Restart with \`npm run dev:server\` after saving.

Your query: *"${lastUser?.content?.slice(0, 120) || ''}"*`,
      model: 'fallback',
      codeSnippet: null,
      usage: null,
    };
  }

  isAvailable() {
    return isGroqAvailable();
  }
}

export default new GroqService();
