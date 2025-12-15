import { Router } from 'express';

import * as statisticsController from '../controllers/statistics.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';

const router: Router = Router();

// All routes require authentication
router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

// Get all dashboard statistics in one endpoint
router.get('/dashboard', statisticsController.getDashboardStatistics);

export default router;
