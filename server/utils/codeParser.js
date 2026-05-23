/**
 * Extract fenced code blocks from LLM responses for structured UI rendering.
 */

const FENCE_REGEX = /```(\w+)?(?:\s+([^\n]+))?\n([\s\S]*?)```/g;

export function extractCodeSnippets(text) {
  const snippets = [];
  let match;

  while ((match = FENCE_REGEX.exec(text)) !== null) {
    snippets.push({
      language: match[1] || 'text',
      filePath: match[2]?.trim(),
      code: match[3].trim(),
    });
  }

  return snippets;
}

export function getPrimaryCodeSnippet(text) {
  const snippets = extractCodeSnippets(text);
  if (!snippets.length) return null;
  const primary = snippets[0];
  return {
    code: primary.code,
    language: primary.language,
    filePath: primary.filePath,
  };
}

export function stripCodeFences(text) {
  return text.replace(FENCE_REGEX, (_, lang, path, code) => {
    const label = path || lang || 'code';
    return `\n[${label} block attached below]\n`;
  });
}
