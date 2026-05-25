# IntelliOS Phase 3 — Cognitive Architecture

## System Flow

```
Client (React services)
    ↓ REST / WebSocket
Cognitive Orchestrator
    ├─ Context Engine (workspace + session + prompt enrichment)
    ├─ Memory Engine (episodic recall → future vector semantic)
    ├─ Agent Router (NLP scoring → Coding | Research | Productivity | Debug)
    ├─ Command Pipeline (slash + NLP → modular handlers)
    └─ Groq Inference
```

## Subsystems

| Layer | Path | Role |
|-------|------|------|
| Memory | `server/memory/` | Persistent recall: conversations, commands, preferences, workflows |
| Context | `server/context/` | Live workspace awareness + enriched system prompts |
| Agents | `server/agents/` | Specialized copilots with dedicated prompts |
| Router | `server/services/agentRouter.js` | Intent → agent scoring |
| Commands | `server/commands/` | OS-style executable operations |
| Analyzer | `server/analyzer/` | Repository / zip intelligence |
| Vector | `server/vector/` | Embedding + semantic index (stub → production) |
| WebSocket | `server/websocket/` | Streaming, agent activity, command status |

## Memory Pipeline

1. **Write** — Every chat, command, and agent run → `memoryEngine.record*`
2. **Store** — MongoDB `Memory` model or ephemeral in-memory fallback
3. **Recall** — `buildRecallContext()` injects recent interactions into system prompt
4. **Semantic** (optional) — `ENABLE_MEMORY=true` → vector index + semantic search

## Agent Routing Strategy

- Keyword/regex rules (bug → Debug, React → Coding, etc.)
- Active page bias (tasks → Productivity, notes → Research)
- Confidence threshold → agent execution vs generic chat
- Fallback → Coding agent

## API Additions (Phase 3)

- `GET /api/memory` — Cognitive recall bundle
- `GET /api/memory/search?q=` — Memory search
- `POST /api/analyzer/workspace` — Analyze current project
- `POST /api/analyzer/upload` — Zip upload analysis
- `POST /api/analyzer/github` — Register GitHub URL (pipeline stub)

## WebSocket Events

- `chat.stream`, `chat.token`, `chat.complete`, `chat.error`
- `command.status`, `command.result`
- `agent.activity`, `agent.routed`
- `typing`

## Scalability

- Stateless API + `sessionId` header
- MongoDB for shared memory across instances
- Vector store interface → swap in Pinecone/Qdrant/Atlas
- Agent registry → add agents without orchestrator changes
- Command handlers → isolated files per OS operation
