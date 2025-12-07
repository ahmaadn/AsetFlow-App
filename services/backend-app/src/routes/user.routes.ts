import { Router } from 'express';

import * as userController from '../controllers/user.controller.js';
import { betterAuthProtect } from '../middleware/auth.middleware.js';

const router: Router = Router();
router.use(betterAuthProtect);

/**
 * @swagger
 * /v1/user/me:
 *   get:
 *     summary: Get the profile of the logged-in user
 *     description: Retrieve the profile information of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/me', userController.getUserProfile);

export default router;
