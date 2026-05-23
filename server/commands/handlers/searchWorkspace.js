export async function searchWorkspace({ args, workspace }) {
  const query = (args.query || '').toLowerCase();
  const notes = workspace.notes || [];
  const tasks = workspace.tasks || [];

  const noteHits = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(query) ||
      n.content?.toLowerCase().includes(query) ||
      n.category?.toLowerCase().includes(query)
  );

  const taskHits = tasks.filter(
    (t) =>
      t.title?.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.category?.toLowerCase().includes(query)
  );

  const lines = [];
  if (noteHits.length) {
    lines.push('**Notes**');
    noteHits.forEach((n) => lines.push(`- [${n.category}] **${n.title}** (${n.id})`));
  }
  if (taskHits.length) {
    lines.push('**Tasks**');
    taskHits.forEach((t) => lines.push(`- [${t.status}] **${t.title}** — ${t.priority} priority`));
  }

  const content =
    lines.length > 0
      ? `Workspace search results for *"${args.query}"*:\n\n${lines.join('\n')}`
      : `No matches for *"${args.query}"* in notes or tasks. Try broader keywords or check spelling.`;

  return {
    summary: `Found ${noteHits.length + taskHits.length} matches`,
    message: { content },
    data: { notes: noteHits, tasks: taskHits },
  };
}
