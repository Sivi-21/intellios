import { isDatabaseReady } from '../../config/database.js';
import { isGroqAvailable } from '../../config/groq.js';
import groqService from '../../services/groqService.js';

export async function systemStatus({ workspace }) {
  const notes = workspace.notes?.length ?? 0;
  const tasks = workspace.tasks?.length ?? 0;
  const open = workspace.tasks?.filter((t) => t.status !== 'completed').length ?? 0;

  return {
    summary: 'System telemetry',
    message: {
      content: `## IntelliOS System Telemetry

| Subsystem | Status |
|-----------|--------|
| **AI Core (Groq)** | ${isGroqAvailable() ? '🟢 Online' : '🟡 Fallback mode'} |
| **MongoDB** | ${isDatabaseReady() ? '🟢 Connected' : '🟡 Ephemeral session'} |
| **Context Engine** | 🟢 Active |
| **Command Router** | 🟢 Ready |
| **Agent Registry** | 🟢 4 agents loaded |

**Workspace**
- Documents indexed: **${notes}**
- Sprint objectives: **${tasks}** (${open} open)
- Active page: **${workspace.activePage || 'dashboard'}**

Neural inference: \`${groqService.resolveModel(workspace.model)}\``,
    },
  };
}
