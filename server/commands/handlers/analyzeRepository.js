import repositoryAnalyzer from '../../analyzer/repositoryAnalyzer.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(__dirname, '../../..');

export async function analyzeRepository({ sessionId, args, workspace, model }) {
  const rootPath = args.rootPath || DEFAULT_ROOT;
  const name = args.name || workspace.activeProject || 'intellios';

  const analysis = await repositoryAnalyzer.analyzeLocalPath({
    sessionId,
    rootPath,
    projectName: name,
    model,
  });

  return {
    summary: `Repository analyzed: ${analysis.name}`,
    message: {
      content: analysis.aiSummary?.content || 'Analysis complete.',
      codeSnippet: analysis.aiSummary?.codeSnippet,
    },
    data: {
      architecture: analysis.architecture,
      fileCount: analysis.fileIndex?.length,
    },
    actions: [{ type: 'activity', title: `Repo scan: ${analysis.name}` }],
  };
}
