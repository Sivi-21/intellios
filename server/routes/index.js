import { Router } from 'express';
import chatRoutes from './chat.routes.js';
import commandRoutes from './command.routes.js';
import contextRoutes from './context.routes.js';
import agentRoutes from './agent.routes.js';
import memoryRoutes from './memory.routes.js';
import analyzerRoutes from './analyzer.routes.js';
import { getHealth } from '../controllers/healthController.js';

const router = Router();

router.get('/health', getHealth);
router.use('/chat', chatRoutes);
router.use('/commands', commandRoutes);
router.use('/context', contextRoutes);
router.use('/agents', agentRoutes);
router.use('/memory', memoryRoutes);
router.use('/analyzer', analyzerRoutes);

export default router;
