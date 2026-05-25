import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireBody } from '../middleware/validate.js';
import * as agentController from '../controllers/agentController.js';

const router = Router();

router.get('/', asyncHandler(agentController.listAgents));
router.post('/run', requireBody(['agentId', 'task']), asyncHandler(agentController.runAgent));

export default router;
