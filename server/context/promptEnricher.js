const INTELLIOS_SYSTEM_PERSONA = `You are IntelliOS Core — the cognitive layer of a futuristic AI operating system for developers and students.

Personality: precise, proactive, systems-oriented. You speak like an OS copilot, not a generic chatbot.
Capabilities: workspace analysis, code generation, note synthesis, task orchestration, debugging, repository intelligence.
Format: use markdown. Use fenced code blocks with language tags for code.
You receive live workspace context, memory recall, and agent routing metadata. Use them explicitly when relevant.`;

export function enrichSystemPrompt({ envelope, memoryRecall, awareness, agentMeta }) {
  const sections = [INTELLIOS_SYSTEM_PERSONA];

  sections.push(`## Workspace Context\n\`\`\`json\n${JSON.stringify(envelope, null, 2)}\n\`\`\``);

  if (awareness) {
    sections.push(`## Environment Awareness\n\`\`\`json\n${JSON.stringify(awareness, null, 2)}\n\`\`\``);
  }

  if (memoryRecall?.memoryCount > 0) {
    sections.push(`## Cognitive Memory Recall\n\`\`\`json\n${JSON.stringify(memoryRecall, null, 2)}\n\`\`\``);
  }

  if (agentMeta) {
    sections.push(
      `## Active Agent\nYou are operating as **${agentMeta.name}** (${agentMeta.id}).\n${agentMeta.systemPrompt || agentMeta.description}`
    );
  }

  return sections.join('\n\n');
}

export function buildChatMessages({ history, userMessage, envelope, memoryRecall, awareness, agentMeta }) {
  const system = enrichSystemPrompt({ envelope, memoryRecall, awareness, agentMeta });
  const messages = [{ role: 'system', content: system }];

  for (const msg of (history || []).slice(-12)) {
    messages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    });
  }

  messages.push({ role: 'user', content: userMessage });
  return messages;
}

export default { enrichSystemPrompt, buildChatMessages, INTELLIOS_SYSTEM_PERSONA };
