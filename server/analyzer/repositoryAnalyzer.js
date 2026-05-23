import fs from 'fs/promises';
import path from 'path';
import Project from '../models/Project.js';
import contextEngine from '../context/contextEngine.js';
import groqService from '../services/groqService.js';
import memoryEngine from '../memory/memoryEngine.js';
import { walkDirectory, readFileSample } from './fileParser.js';
import { analyzeArchitecture } from './architectureAnalyzer.js';
import { isDatabaseReady } from '../config/database.js';
import { generateId } from '../utils/id.js';
import logger from '../utils/logger.js';

export class RepositoryAnalyzer {
  async analyzeLocalPath({ sessionId, rootPath, projectName, model }) {
    const name = projectName || path.basename(rootPath);
    const fileIndex = await walkDirectory(rootPath);
    const architecture = analyzeArchitecture(fileIndex);

    const keyFiles = pickKeyFiles(fileIndex);
    const samples = [];
    for (const f of keyFiles.slice(0, 6)) {
      samples.push({
        path: f.path,
        excerpt: await readFileSample(rootPath, f.path, 1500),
      });
    }

    const project = await this.persistProject(sessionId, {
      name,
      rootPath,
      source: 'local',
      fileIndex,
      architecture,
    });

    const aiSummary = await this.summarizeWithAI({
      sessionId,
      name,
      architecture,
      samples,
      model,
    });

    return {
      projectId: project?._id,
      name,
      fileIndex: fileIndex.slice(0, 100),
      architecture,
      samples: samples.map((s) => ({ path: s.path, length: s.excerpt.length })),
      aiSummary,
    };
  }

  async analyzeFromFileIndex({ sessionId, name, fileIndex, samples, model }) {
    const architecture = analyzeArchitecture(fileIndex);
    const project = await this.persistProject(sessionId, {
      name,
      source: 'zip',
      fileIndex,
      architecture,
    });

    const aiSummary = await this.summarizeWithAI({
      sessionId,
      name,
      architecture,
      samples,
      model,
    });

    return { projectId: project?._id, name, architecture, aiSummary };
  }

  async persistProject(sessionId, data) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').slice(0, 48);
    const payload = {
      sessionId,
      name: data.name,
      slug: `${slug}-${generateId('p').slice(4, 8)}`,
      source: data.source || 'local',
      rootPath: data.rootPath,
      fileIndex: data.fileIndex?.slice(0, 500),
      analysis: data.architecture,
      lastAnalyzedAt: new Date(),
      status: 'ready',
    };

    if (isDatabaseReady()) {
      return Project.create(payload);
    }
    return { _id: generateId('proj'), ...payload };
  }

  async summarizeWithAI({ sessionId, name, architecture, samples, model }) {
    const workspace = { activePage: 'analyzer', activeProject: name };
    const prompt = `Analyze repository "${name}" for IntelliOS.

Architecture heuristics:
\`\`\`json
${JSON.stringify(architecture, null, 2)}
\`\`\`

Key file excerpts:
${samples.map((s) => `### ${s.path}\n\`\`\`\n${s.excerpt}\n\`\`\``).join('\n\n')}

Deliver:
1. Architecture overview
2. Dependency/stack observations
3. Scalability assessment
4. Risks and bugs to watch
5. Top 5 improvements`;

    const { messages } = await contextEngine.buildInferenceContext(
      sessionId,
      workspace,
      prompt,
      []
    );

    try {
      const result = await groqService.complete({ messages, model, temperature: 0.4 });
      await memoryEngine.recordInteraction(sessionId, {
        type: 'project',
        content: `Analyzed repo: ${name}`,
        summary: result.content.slice(0, 300),
        tags: ['analyzer', 'repository'],
      });
      return { content: result.content, codeSnippet: result.codeSnippet };
    } catch (err) {
      logger.warn('AI summarization failed', { error: err.message });
      return {
        content: buildOfflineSummary(name, architecture),
      };
    }
  }
}

function pickKeyFiles(fileIndex) {
  const priority = ['package.json', 'README.md', 'server/server.js', 'src/App.tsx', 'vite.config.ts'];
  const picked = [];
  for (const p of priority) {
    const f = fileIndex.find((x) => x.path === p || x.path.endsWith(p));
    if (f) picked.push(f);
  }
  const code = fileIndex.filter((f) => f.isCode && f.size < 80000);
  for (const f of code) {
    if (picked.length >= 12) break;
    if (!picked.find((x) => x.path === f.path)) picked.push(f);
  }
  return picked;
}

function buildOfflineSummary(name, architecture) {
  return `## Repository: ${name}

**Files scanned:** ${architecture.totalFiles} (${architecture.codeFiles} code)

**Detected patterns:** ${architecture.patterns.join(', ') || 'generic'}

**Structure score:** ${architecture.structureScore}/100

${architecture.scalabilityNotes.map((n) => `- ${n}`).join('\n')}

*Connect Groq API for full AI architecture narrative.*`;
}

export default new RepositoryAnalyzer();
