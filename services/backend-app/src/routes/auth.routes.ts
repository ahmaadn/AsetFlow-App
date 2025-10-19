import { Router } from 'express';

import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middlewate';
import { registerSchema } from '../schemas/auth.schema';

const router = Router();

/**
 * @swagger
 * /v1/auth/register:
 *  post:
 *    summary: Register a new user
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/RegisterUser'
 *    responses:
 *      201:
 *        description: User registered successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Authentication'
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /v1/auth/login:
 *  post:
 *    summary: Login a user
 *    tags:
 *      - Authentication
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *           $ref: '#/components/schemas/LoginUser'
 *    responses:
 *      200:
 *        description: User logged in successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Authentication'
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ApiError'
 */
router.post('/login', authController.login);

export default router;
