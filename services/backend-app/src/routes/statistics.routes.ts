import { Router } from 'express';

import statisticsController from '../controllers/statistics.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';

export function createStatisticsRoutes(): Router {
  const router: Router = Router();

  router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

  /**
   * @swagger
   * /v1/statistics/dashboard:
   *   get:
   *     summary: Get user dashboard statistics
   *     tags: [Statistics]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         $ref : '#/components/responses/UserDashboardStatisticsResponse'
   *       4xx:
   *        $ref : '#/components/responses/ApiError'
   *       5xx:
   *        $ref : '#/components/responses/ApiError'
   */
  router.get(
    '/dashboard',
    statisticsController.getUserDashboardStatistics.bind(statisticsController)
  );

  return router;
}
export default createStatisticsRoutes;
