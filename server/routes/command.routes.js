import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireBody } from '../middleware/validate.js';
import * as commandController from '../controllers/commandController.js';

const router = Router();

router.get('/', asyncHandler(commandController.listCommands));
router.post('/execute', requireBody(['input']), asyncHandler(commandController.executeCommand));
router.post('/parse', requireBody(['input']), asyncHandler(commandController.parseIntent));

export default router;
