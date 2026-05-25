import fs from 'fs/promises';
import path from 'path';

const CODE_EXT = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.py', '.go', '.rs', '.java', '.json',
  '.md', '.css', '.html', '.vue', '.svelte', '.yml', '.yaml',
]);

const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'coverage', '__pycache__',
]);

export async function walkDirectory(rootPath, { maxFiles = 500, maxDepth = 8 } = {}) {
  const files = [];

  async function walk(dir, depth) {
    if (depth > maxDepth || files.length >= maxFiles) return;

    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (files.length >= maxFiles) break;
      if (entry.name.startsWith('.') && entry.name !== '.env.example') continue;
      if (SKIP_DIRS.has(entry.name)) continue;

      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full, depth + 1);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const stat = await fs.stat(full).catch(() => null);
        files.push({
          path: path.relative(rootPath, full).replace(/\\/g, '/'),
          name: entry.name,
          ext,
          size: stat?.size ?? 0,
          language: extToLanguage(ext),
          isCode: CODE_EXT.has(ext),
        });
      }
    }
  }

  await walk(rootPath, 0);
  return files;
}

function extToLanguage(ext) {
  const map = {
    '.ts': 'typescript', '.tsx': 'typescript', '.js': 'javascript', '.jsx': 'javascript',
    '.py': 'python', '.rs': 'rust', '.go': 'go', '.json': 'json', '.md': 'markdown',
  };
  return map[ext] || 'text';
}

export async function readFileSample(rootPath, relativePath, maxChars = 4000) {
  const full = path.join(rootPath, relativePath);
  const content = await fs.readFile(full, 'utf8').catch(() => '');
  return content.slice(0, maxChars);
}

export default { walkDirectory, readFileSample };
