import {
  httpForgetPasswordSchema,
  httpLoginSchema,
  httpRegisterSchema,
  httpResetPasswordSchema,
} from '@asetflow/validators';
import { Router } from 'express';

import { passwordController } from '../controllers/auth/password.controller.js';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';

/**
 * Function to create authentication routes.
 * @returns
 */
export function createAuthRoutes(): Router {
  const router: Router = Router();

  router.post(
    '/login',
    validate(httpLoginSchema),
    authController.login.bind(authController)
  );

  router.post('/refresh', authController.refreshToken.bind(authController));

  router.post('/logout', authController.logout.bind(authController));

  router.post(
    '/register',
    validate(httpRegisterSchema),
    authController.register.bind(authController)
  );

  router.post(
    '/forget-password',
    validate(httpForgetPasswordSchema),
    passwordController.forgetPassword.bind(passwordController)
  );

  router.post(
    '/reset-password',
    validate(httpResetPasswordSchema),
    passwordController.resetPassword.bind(passwordController)
  );

  return router;
}

export default createAuthRoutes;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *         headers:
 *           Set-Cookie:
 *             description: Refresh token as httpOnly cookie
 *             schema:
 *               type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials or email not verified
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     expiresIn:
 *                       type: number
 *                     user:
 *                       type: object
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
