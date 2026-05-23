import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import * as contextController from '../controllers/contextController.js';

const router = Router();

router.get('/', asyncHandler(contextController.getContext));
router.patch('/', asyncHandler(contextController.updateContext));

export default router;
