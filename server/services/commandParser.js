/**
 * Intelligent command parsing — maps natural language and slash commands to intents.
 */

const INTENT_PATTERNS = [
  { intent: 'summarize_notes', patterns: [/summarize\s+(my\s+)?notes/i, /notes?\s+summary/i, /digest\s+notes/i] },
  { intent: 'analyze_project', patterns: [/analyze\s+(the\s+)?project/i, /project\s+analysis/i, /audit\s+workspace/i, /scan\s+project/i] },
  { intent: 'generate_component', patterns: [/generate\s+(a\s+)?react/i, /create\s+component/i, /build\s+ui\s+component/i, /tsx\s+component/i] },
  { intent: 'explain_errors', patterns: [/explain\s+(this\s+)?error/i, /debug\s+error/i, /fix\s+error/i, /why\s+is\s+this\s+failing/i] },
  { intent: 'search_workspace', patterns: [/search\s+workspace/i, /find\s+in\s+workspace/i, /lookup\s+/i, /search\s+for\s+/i] },
  { intent: 'create_tasks', patterns: [/\/task\b/i, /create\s+task/i, /add\s+task/i, /spawn\s+objective/i] },
  { intent: 'create_note', patterns: [/\/note\b/i, /create\s+note/i, /new\s+note/i] },
  { intent: 'clear_chat', patterns: [/\/clear\b/i, /clear\s+chat/i, /reset\s+conversation/i] },
  { intent: 'system_status', patterns: [/system\s+status/i, /telemetry/i, /diagnostics/i, /workspace\s+stats/i] },
  { intent: 'open_tasks', patterns: [/open\s+tasks/i, /show\s+tasks/i, /list\s+tasks/i, /target\s+board/i] },
  { intent: 'generate_architecture', patterns: [/generate\s+architecture/i, /architecture\s+doc/i, /system\s+design\s+doc/i] },
  { intent: 'analyze_repository', patterns: [/analyze\s+(the\s+)?repo/i, /scan\s+repository/i, /repository\s+analysis/i] },
];

const SLASH_MAP = {
  '/summarize': 'summarize_notes',
  '/analyze': 'analyze_project',
  '/repo': 'analyze_repository',
  '/component': 'generate_component',
  '/debug': 'explain_errors',
  '/search': 'search_workspace',
  '/task': 'create_tasks',
  '/note': 'create_note',
  '/tasks': 'open_tasks',
  '/arch': 'generate_architecture',
  '/clear': 'clear_chat',
  '/status': 'system_status',
};

export function parseCommand(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return { intent: 'chat', raw: '', args: {}, confidence: 0 };
  }

  const slash = trimmed.split(/\s+/)[0].toLowerCase();
  if (SLASH_MAP[slash]) {
    return {
      intent: SLASH_MAP[slash],
      raw: trimmed,
      args: extractArgs(trimmed, SLASH_MAP[slash]),
      confidence: 1,
      source: 'slash',
    };
  }

  for (const { intent, patterns } of INTENT_PATTERNS) {
    if (patterns.some((p) => p.test(trimmed))) {
      return {
        intent,
        raw: trimmed,
        args: extractArgs(trimmed, intent),
        confidence: 0.85,
        source: 'nlp',
      };
    }
  }

  return {
    intent: 'chat',
    raw: trimmed,
    args: { query: trimmed },
    confidence: 0.5,
    source: 'default',
  };
}

function extractArgs(raw, intent) {
  const args = { query: raw };

  switch (intent) {
    case 'create_tasks': {
      const title = raw.replace(/^\/task\s*/i, '').replace(/create\s+task\s*/i, '').trim();
      args.title = title || 'New IntelliOS Objective';
      break;
    }
    case 'create_note': {
      const title = raw.replace(/^\/note\s*/i, '').replace(/create\s+note\s*/i, '').trim();
      args.title = title || 'Untitled Blueprint';
      break;
    }
    case 'search_workspace': {
      args.query = raw.replace(/search\s+(workspace\s+)?(for\s+)?/i, '').trim() || raw;
      break;
    }
    case 'explain_errors': {
      args.errorContext = raw.replace(/explain\s+(this\s+)?error\s*/i, '').trim();
      break;
    }
    case 'generate_component': {
      args.spec = raw.replace(/generate\s+(a\s+)?react\s+component\s*/i, '').trim() || raw;
      break;
    }
    default:
      break;
  }

  return args;
}

export function intentToHandler(intent) {
  const map = {
    summarize_notes: 'summarizeNotes',
    analyze_project: 'analyzeProject',
    generate_component: 'generateComponent',
    explain_errors: 'explainErrors',
    search_workspace: 'searchWorkspace',
    create_tasks: 'createTasks',
    create_note: 'createNote',
    clear_chat: 'clearChat',
    system_status: 'systemStatus',
    open_tasks: 'openTasks',
    generate_architecture: 'generateArchitecture',
    analyze_repository: 'analyzeRepository',
    chat: null,
  };
  return map[intent] ?? null;
}
