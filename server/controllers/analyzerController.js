import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';
import AdmZip from 'adm-zip';
import env from '../config/env.js';
import repositoryAnalyzer from '../analyzer/repositoryAnalyzer.js';
import { walkDirectory, readFileSample } from '../analyzer/fileParser.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateId } from '../utils/id.js';

const uploadDir = path.resolve(env.UPLOAD_DIR);
fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

export const upload = multer({
  dest: uploadDir,
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 },
});

export async function analyzeWorkspace(req, res) {
  const { projectName, model } = req.body;
  const result = await repositoryAnalyzer.analyzeLocalPath({
    sessionId: req.sessionId,
    rootPath: path.resolve(process.cwd()),
    projectName: projectName || 'intellios',
    model,
  });
  res.json({ success: true, ...result });
}

export async function analyzeUpload(req, res) {
  if (!req.file) throw new AppError('No file uploaded', 400, 'NO_FILE');

  const extractDir = path.join(uploadDir, `extract-${generateId('zip')}`);
  await fs.mkdir(extractDir, { recursive: true });

  try {
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(extractDir, true);

    const fileIndex = await walkDirectory(extractDir);
    const keyFiles = fileIndex.filter((f) => f.isCode).slice(0, 8);
    const samples = [];
    for (const f of keyFiles) {
      samples.push({
        path: f.path,
        excerpt: await readFileSample(extractDir, f.path, 1200),
      });
    }

    const result = await repositoryAnalyzer.analyzeFromFileIndex({
      sessionId: req.sessionId,
      name: req.body.projectName || req.file.originalname.replace(/\.zip$/i, ''),
      fileIndex,
      samples,
      model: req.body.model,
    });

    res.json({ success: true, ...result });
  } finally {
    await fs.unlink(req.file.path).catch(() => {});
  }
}

export async function registerGithub(req, res) {
  const { url, model } = req.body;
  if (!url) throw new AppError('GitHub URL required', 400);

  res.json({
    success: true,
    status: 'queued',
    message: `Repository ${url} registered for analysis. Clone + index pipeline ready for Phase 3.1.`,
    hint: 'Use POST /api/analyzer/upload with a zip export for immediate analysis.',
    model,
  });
}
