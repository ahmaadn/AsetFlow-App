import { Router } from 'express';

import statisticsController from '../controllers/statistics.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';

export function createStatisticsRoutes(): Router {
  const router: Router = Router();

  router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

  router.get(
    '/dashboard',
    statisticsController.getUserDashboardStatistics.bind(statisticsController)
  );

  return router;
}
export default createStatisticsRoutes;
