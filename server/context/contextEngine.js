import sessionTracker from './sessionTracker.js';
import { analyzeWorkspaceState } from './workspaceAwareness.js';
import { buildChatMessages, enrichSystemPrompt } from './promptEnricher.js';
import memoryEngine from '../memory/memoryEngine.js';

/**
 * Context Engine — unified workspace awareness + prompt enrichment for all inference.
 */
export class ContextEngine {
  async getSession(sessionId) {
    return sessionTracker.get(sessionId);
  }

  async updateContext(sessionId, patch, workspace) {
    if (patch.recentAction) {
      await sessionTracker.track(sessionId, {
        type: patch.recentAction.type || 'action',
        summary: patch.recentAction.summary,
        page: workspace?.activePage,
        meta: patch.recentAction,
      });
    }

    const session = await sessionTracker.get(sessionId);
    const merged = {
      ...session.context,
      ...patch,
      activePage: patch.activePage ?? workspace?.activePage,
      activeProject: patch.activeProject ?? workspace?.activeProject,
      selectedNoteId: workspace?.selectedNote?.id,
      selectedTaskId: workspace?.selectedTask?.id,
    };
    delete merged.recentAction;

    await sessionTracker.update(sessionId, merged);
    return merged;
  }

  buildContextEnvelope(workspace = {}) {
    const {
      activePage,
      activeProject,
      openWorkspace,
      selectedNote,
      selectedTask,
      notes = [],
      tasks = [],
      recentActivities = [],
      userProfile = {},
    } = workspace;

    const awareness = analyzeWorkspaceState(workspace);

    return {
      timestamp: new Date().toISOString(),
      activePage: activePage || 'dashboard',
      activeProject: activeProject || 'intellios-workspace',
      openWorkspace: openWorkspace || 'default',
      selectedNote: selectedNote || null,
      selectedTask: selectedTask || null,
      user: { name: userProfile.name, role: userProfile.role },
      notesIndex: notes.slice(0, 8).map((n) => ({
        id: n.id,
        title: n.title,
        category: n.category,
        excerpt: (n.content || '').slice(0, 200),
      })),
      tasksIndex: tasks.slice(0, 10).map((t) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        category: t.category,
      })),
      recentActivities: recentActivities.slice(0, 6),
      awareness,
      stats: {
        noteCount: notes.length,
        taskCount: tasks.length,
        openTasks: tasks.filter((t) => t.status !== 'completed').length,
      },
    };
  }

  async buildInferenceContext(sessionId, workspace, userMessage, history, agentMeta) {
    const envelope = this.buildContextEnvelope(workspace);
    const memoryRecall = await memoryEngine.buildRecallContext(sessionId, userMessage);
    const awareness = envelope.awareness;

    const messages = buildChatMessages({
      history,
      userMessage,
      envelope,
      memoryRecall,
      awareness,
      agentMeta,
    });

    return { envelope, memoryRecall, awareness, messages };
  }

  buildSystemPrompt(envelope, memoryRecall, awareness, agentMeta) {
    return enrichSystemPrompt({ envelope, memoryRecall, awareness, agentMeta });
  }

  buildMessages(history, userMessage, envelope, extras = {}) {
    return buildChatMessages({
      history,
      userMessage,
      envelope,
      memoryRecall: extras.memoryRecall,
      awareness: extras.awareness || envelope.awareness,
      agentMeta: extras.agentMeta,
    });
  }
}

export default new ContextEngine();
