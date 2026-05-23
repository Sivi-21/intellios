/**
 * Lightweight markdown transforms for chat display.
 * Full parsing happens client-side; server normalizes AI output.
 */

export function stripMarkdownForPrompt(text) {
  return text.replace(/```[\s\S]*?```/g, '[code block]').trim();
}

export function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatAssistantText(raw) {
  return raw.trim();
}
