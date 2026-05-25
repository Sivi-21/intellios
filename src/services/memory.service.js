import { apiRequest } from "./api.js";
export async function getMemoryContext(query = "") {
  const q = query ? `?query=${encodeURIComponent(query)}` : "";
  return apiRequest(`/memory${q}`);
}
export async function searchMemory(q) {
  return apiRequest(`/memory/search?q=${encodeURIComponent(q)}`);
}
export async function listMemories(category) {
  const params = category ? `?category=${category}` : "";
  return apiRequest(`/memory/list${params}`);
}
export async function savePreference(key, value) {
  return apiRequest("/memory/preferences", {
    method: "POST",
    body: JSON.stringify({ key, value })
  });
}
export default { getMemoryContext, searchMemory, listMemories, savePreference };
