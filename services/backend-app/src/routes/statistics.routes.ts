import { Router } from 'express';

import * as statisticsController from '../controllers/statistics.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(protect);

// Get all dashboard statistics in one endpoint
router.get('/dashboard', statisticsController.getDashboardStatistics);

export default router;
