export async function openTasks({ workspace }) {
  const tasks = workspace.tasks || [];
  const open = tasks.filter((t) => t.status !== 'completed');

  const lines = open.length
    ? open.map((t) => `- **[${t.status}]** ${t.title} (${t.priority}) — ${t.category}`)
    : ['- No open objectives. Create one with `/task [title]`'];

  return {
    summary: `${open.length} open tasks`,
    message: {
      content: `## Target Board — Open Objectives\n\n${lines.join('\n')}\n\nNavigate to **Tasks** in IntelliOS to update statuses.`,
    },
    actions: [{ type: 'navigate', target: '/tasks' }],
    data: { openTasks: open },
  };
}
