import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as memoryController from '../controllers/memoryController.js';

const router = Router();

router.get('/', asyncHandler(memoryController.getMemoryContext));
router.get('/search', asyncHandler(memoryController.searchMemory));
router.get('/list', asyncHandler(memoryController.listMemories));
router.post('/preferences', asyncHandler(memoryController.savePreference));

export default router;
