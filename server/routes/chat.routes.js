import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireBody } from '../middleware/validate.js';
import * as chatController from '../controllers/chatController.js';

const router = Router();

router.post('/message', requireBody(['message']), asyncHandler(chatController.sendMessage));
router.get('/history', asyncHandler(chatController.getHistory));
router.delete('/history', asyncHandler(chatController.clearHistory));

export default router;
