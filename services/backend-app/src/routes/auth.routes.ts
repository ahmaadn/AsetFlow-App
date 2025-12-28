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
 */
export function createAuthRoutes(): Router {
  const router: Router = Router();

  /**
   * @swagger
   * /v1/auth/login:
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
   *         $ref : '#/components/responses/PayloadTokenResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post(
    '/login',
    validate(httpLoginSchema),
    authController.login.bind(authController)
  );

  /**
   * @swagger
   * /v1/auth/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshTokenRequest'
   *     responses:
   *       200:
   *         $ref : '#/components/responses/RefreshTokenResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post('/refresh', authController.refreshToken.bind(authController));

  /**
   * @swagger
   * /v1/auth/logout:
   *   post:
   *     summary: User logout
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RefreshTokenRequest'
   *     responses:
   *       200:
   *         $ref : '#/components/responses/SuccessResponse'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post('/logout', authController.logout.bind(authController));

  /**
   * @swagger
   * /v1/auth/register:
   *   post:
   *     summary: User registration
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *         schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *    responses:
   *     201:
   *       $ref : '#/components/responses/SuccessResponse'
   *     400:
   *       $ref : '#/components/responses/BadRequestError'
   *     422:
   *       $ref : '#/components/responses/ValidationError'
   *     500:
   *       $ref : '#/components/responses/ApiError'
   */
  router.post(
    '/register',
    validate(httpRegisterSchema),
    authController.register.bind(authController)
  );

  /**
   * @swagger
   * /v1/auth/forget-password:
   *   post:
   *     summary: Request password reset
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RequestForgetPassword'
   *     responses:
   *       200:
   *         $ref : '#/components/responses/SuccessResponse'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post(
    '/forget-password',
    validate(httpForgetPasswordSchema),
    passwordController.forgetPassword.bind(passwordController)
  );

  /**
   * @swagger
   * /v1/auth/reset-password:
   *   post:
   *     summary: Reset user password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPasswordRequest'
   *     responses:
   *       200:
   *         $ref : '#/components/responses/SuccessResponse'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post(
    '/reset-password',
    validate(httpResetPasswordSchema),
    passwordController.resetPassword.bind(passwordController)
  );

  return router;
}

export default createAuthRoutes;
