/**
 * Heuristic architecture analysis from repository file index.
 */
export function analyzeArchitecture(fileIndex = []) {
  const codeFiles = fileIndex.filter((f) => f.isCode);
  const byExt = {};
  const topLevel = {};

  for (const f of codeFiles) {
    byExt[f.ext] = (byExt[f.ext] || 0) + 1;
    const root = f.path.split('/')[0];
    topLevel[root] = (topLevel[root] || 0) + 1;
  }

  const patterns = detectPatterns(fileIndex);

  return {
    totalFiles: fileIndex.length,
    codeFiles: codeFiles.length,
    languages: byExt,
    topLevelFolders: topLevel,
    patterns,
    structureScore: scoreStructure(fileIndex),
    scalabilityNotes: buildScalabilityNotes(patterns, codeFiles.length),
  };
}

function detectPatterns(fileIndex) {
  const paths = fileIndex.map((f) => f.path);
  const patterns = [];

  if (paths.some((p) => p.includes('server/') || p.includes('api/'))) patterns.push('backend-api');
  if (paths.some((p) => p.startsWith('src/') && paths.some((x) => x.endsWith('.tsx')))) patterns.push('react-spa');
  if (paths.some((p) => p.includes('vite.config'))) patterns.push('vite');
  if (paths.some((p) => p === 'package.json')) patterns.push('nodejs-monorepo');
  if (paths.some((p) => p.includes('docker'))) patterns.push('containerized');
  if (paths.some((p) => p.includes('test') || p.includes('spec.'))) patterns.push('tested');

  return patterns;
}

function scoreStructure(fileIndex) {
  let score = 50;
  const hasSrc = fileIndex.some((f) => f.path.startsWith('src/') || f.path.startsWith('server/'));
  const hasPkg = fileIndex.some((f) => f.path === 'package.json');
  if (hasSrc) score += 20;
  if (hasPkg) score += 10;
  if (fileIndex.length > 20 && fileIndex.length < 2000) score += 10;
  return Math.min(score, 100);
}

function buildScalabilityNotes(patterns, codeCount) {
  const notes = [];
  if (patterns.includes('react-spa') && patterns.includes('backend-api')) {
    notes.push('Full-stack separation supports horizontal API scaling.');
  }
  if (codeCount > 300) notes.push('Consider module boundaries and lazy-loading for large codebases.');
  if (!patterns.includes('tested')) notes.push('Add automated tests to improve change confidence at scale.');
  return notes;
}

export default { analyzeArchitecture };
