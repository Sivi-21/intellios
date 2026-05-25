# IntelliOS Intelligence Layer (Phase 2 + Phase 3)

Production-grade AI backend for the IntelliOS operating shell.

## Quick Start

```bash
# From project root
cp .env.example .env
# Add GROQ_API_KEY to .env

npm install
npm run dev:server   # AI Core on :5000
npm run dev          # Frontend on :3000
# Or both:
npm run dev:all
```

## API Surface

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Subsystem status |
| `/api/chat/message` | POST | Chat or auto-routed commands |
| `/api/chat/history` | GET | Session conversation |
| `/api/commands/execute` | POST | Direct command execution |
| `/api/commands/parse` | POST | Intent classification preview |
| `/api/context` | GET/PATCH | Session context envelope |
| `/api/agents` | GET | List registered agents |
| `/api/agents/run` | POST | Run a specific agent |

WebSocket: `ws://localhost:5000/ws?sessionId=...`

Events: `chat.stream`, `chat.token`, `chat.complete`, `command.execute`, `typing`

## Slash Commands

- `/summarize` — Notes digest
- `/analyze` — Workspace analysis
- `/repo` — Repository deep scan
- `/arch` — Generate architecture doc
- `/component` — Generate React component
- `/debug` — Explain errors
- `/search [query]` — Search notes/tasks
- `/tasks` — Open tasks board summary
- `/task [title]` — Create task
- `/note [title]` — Create note
- `/clear` — Reset conversation
- `/status` — System telemetry

See [ARCHITECTURE.md](./ARCHITECTURE.md) for Phase 3 cognitive layer design.
