import { apiRequest } from "./api.js";
export async function listCommands() {
  return apiRequest("/commands");
}
export async function executeCommand(input, workspace) {
  return apiRequest("/commands/execute", {
    method: "POST",
    body: JSON.stringify({ input, workspace, model: workspace?.model })
  });
}
export async function parseIntent(input) {
  return apiRequest("/commands/parse", {
    method: "POST",
    body: JSON.stringify({ input })
  });
}
export default { listCommands, executeCommand, parseIntent };
