import { apiRequest } from "./api.js";
export async function listAgents() {
  return apiRequest("/agents");
}
export async function runAgent(agentId, task, workspace) {
  return apiRequest("/agents/run", {
    method: "POST",
    body: JSON.stringify({ agentId, task, workspace, model: workspace?.model })
  });
}
export async function analyzeRepository(workspace, projectName) {
  return apiRequest("/analyzer/workspace", {
    method: "POST",
    body: JSON.stringify({ projectName, model: workspace?.model })
  });
}
export async function uploadRepositoryZip(file, projectName) {
  const form = new FormData();
  form.append("repository", file);
  if (projectName) form.append("projectName", projectName);
  return apiRequest("/analyzer/upload", {
    method: "POST",
    body: form
  });
}
export default { listAgents, runAgent, analyzeRepository, uploadRepositoryZip };
