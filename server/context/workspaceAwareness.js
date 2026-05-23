/**
 * Derives live workspace signals from client snapshot for context enrichment.
 */
export function analyzeWorkspaceState(workspace = {}) {
  const page = workspace.activePage || 'dashboard';
  const openTasks = (workspace.tasks || []).filter((t) => t.status !== 'completed');
  const urgentTasks = openTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  return {
    focusMode: page === 'chat' ? 'inference' : page === 'tasks' ? 'execution' : 'navigation',
    activeSurface: page,
    hasSelectedNote: Boolean(workspace.selectedNote?.id),
    hasSelectedTask: Boolean(workspace.selectedTask?.id),
    openTaskCount: openTasks.length,
    urgentTaskCount: urgentTasks.length,
    noteCount: workspace.notes?.length ?? 0,
    lastActivity: workspace.recentActivities?.[0] || null,
    suggestedAgentHints: buildAgentHints(workspace),
  };
}

function buildAgentHints(workspace) {
  const hints = [];
  const page = workspace.activePage;
  if (page === 'tasks') hints.push('productivity');
  if (page === 'notes') hints.push('research');
  if (page === 'chat') hints.push('coding', 'debugging');
  return [...new Set(hints)];
}

export default { analyzeWorkspaceState };
