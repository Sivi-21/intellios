import Memory from '../models/Memory.js';
import { isDatabaseReady } from '../config/database.js';
import { generateId } from '../utils/id.js';

const ephemeralStore = new Map();

function bucketKey(sessionId) {
  return `mem:${sessionId}`;
}

export class MemoryStore {
  async save(entry) {
    const doc = {
      sessionId: entry.sessionId,
      userId: entry.userId,
      projectId: entry.projectId,
      category: entry.category,
      key: entry.key || generateId('memkey'),
      content: entry.content,
      summary: entry.summary || entry.content.slice(0, 240),
      importance: entry.importance ?? 0.5,
      tags: entry.tags || [],
      metadata: entry.metadata || {},
      sourceId: entry.sourceId,
    };

    if (isDatabaseReady()) {
      return Memory.create(doc);
    }

    const list = ephemeralStore.get(bucketKey(entry.sessionId)) || [];
    const saved = { ...doc, _id: generateId('mem'), createdAt: new Date(), updatedAt: new Date() };
    list.unshift(saved);
    ephemeralStore.set(bucketKey(entry.sessionId), list.slice(0, 200));
    return saved;
  }

  async findBySession(sessionId, { category, limit = 20, since } = {}) {
    const query = { sessionId };
    if (category) query.category = category;
    if (since) query.updatedAt = { $gte: since };

    if (isDatabaseReady()) {
      return Memory.find(query).sort({ updatedAt: -1 }).limit(limit).select('-embedding');
    }

    let list = ephemeralStore.get(bucketKey(sessionId)) || [];
    if (category) list = list.filter((m) => m.category === category);
    return list.slice(0, limit);
  }

  async search(sessionId, text, limit = 10) {
    const terms = text.toLowerCase().split(/\s+/).filter(Boolean);
    const all = await this.findBySession(sessionId, { limit: 100 });
    const scored = all
      .map((m) => {
        const hay = `${m.summary} ${m.content} ${(m.tags || []).join(' ')}`.toLowerCase();
        const score = terms.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
        return { m, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((x) => x.m);
  }

  async deleteByKey(sessionId, key) {
    if (isDatabaseReady()) {
      return Memory.deleteOne({ sessionId, key });
    }
    const list = ephemeralStore.get(bucketKey(sessionId)) || [];
    ephemeralStore.set(
      bucketKey(sessionId),
      list.filter((m) => m.key !== key)
    );
  }
}

export default new MemoryStore();
