import memoryEngine from '../memory/memoryEngine.js';
import memoryStore from '../memory/memoryStore.js';

export async function getMemoryContext(req, res) {
  const { query } = req.query;
  const recall = await memoryEngine.buildRecallContext(req.sessionId, query || '');
  res.json({ success: true, sessionId: req.sessionId, recall });
}

export async function searchMemory(req, res) {
  const { q } = req.query;
  const results = await memoryEngine.search(req.sessionId, q || '');
  res.json({ success: true, results });
}

export async function listMemories(req, res) {
  const { category, limit } = req.query;
  const items = await memoryStore.findBySession(req.sessionId, {
    category,
    limit: parseInt(limit || '30', 10),
  });
  res.json({ success: true, items });
}

export async function savePreference(req, res) {
  const { key, value } = req.body;
  await memoryEngine.savePreference(req.sessionId, key, value);
  res.json({ success: true });
}
