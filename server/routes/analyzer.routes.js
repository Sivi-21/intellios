import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as analyzerController from '../controllers/analyzerController.js';

const router = Router();

router.post('/workspace', asyncHandler(analyzerController.analyzeWorkspace));
router.post(
  '/upload',
  analyzerController.upload.single('repository'),
  asyncHandler(analyzerController.analyzeUpload)
);
router.post('/github', asyncHandler(analyzerController.registerGithub));

export default router;
