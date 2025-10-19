import { Router } from 'express';

import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /v1/user/me:
 *   get:
 *     summary: Get the profile of the logged-in user
 *     description: Retrieve the profile information of the authenticated user.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/me', protect, userController.getUserProfile);

export default router;
