import Session from '../models/Session.js';
import { isDatabaseReady } from '../config/database.js';
import { generateId } from '../utils/id.js';

const ephemeral = new Map();

export class SessionTracker {
  async track(sessionId, event) {
    const entry = {
      id: generateId('evt'),
      type: event.type,
      summary: event.summary,
      page: event.page,
      meta: event.meta,
      at: new Date().toISOString(),
    };

    const session = await this.get(sessionId);
    const recentActions = [entry, ...(session.context?.recentActions || [])].slice(0, 30);

    return this.update(sessionId, {
      ...session.context,
      recentActions,
      lastEvent: entry,
    });
  }

  async get(sessionId) {
    if (isDatabaseReady()) {
      let doc = await Session.findOne({ sessionId });
      if (!doc) doc = await Session.create({ sessionId, context: { recentActions: [] } });
      return doc.toObject();
    }
    if (!ephemeral.has(sessionId)) {
      ephemeral.set(sessionId, { sessionId, context: { recentActions: [] } });
    }
    return ephemeral.get(sessionId);
  }

  async update(sessionId, context) {
    if (isDatabaseReady()) {
      await Session.findOneAndUpdate(
        { sessionId },
        { context, lastActivityAt: new Date() },
        { upsert: true }
      );
    } else {
      ephemeral.set(sessionId, { sessionId, context });
    }
    return context;
  }
}

export default new SessionTracker();
