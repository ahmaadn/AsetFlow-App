import { Router } from 'express';

import userController from '../controllers/user.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';

export function createUserRoutes(): Router {
  const router: Router = Router();
  router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

  /**
   * @swagger
   * /v1/users/me:
   *   get:
   *     summary: Get the profile of the logged-in user
   *     description: Retrieve the profile information of the authenticated user.
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         $ref: '#/components/responses/UserInfoResponse'
   *       4xx:
   *         $ref : '#/components/responses/ApiError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       5xx:
   *         $ref : '#/components/responses/ApiError'
   */
  router.get('/me', userController.getUserProfile.bind(userController));
  return router;
}
export default createUserRoutes;
