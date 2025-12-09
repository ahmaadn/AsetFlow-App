import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller.js';
import { betterAuthProtect } from '../middleware/auth.middleware.js';

const router: Router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     SessionData:
 *       type: object
 *       properties:
 *         session:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             userId:
 *               type: string
 *             expiresAt:
 *               type: string
 *               format: date-time
 *             token:
 *               type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             name:
 *               type: string
 *             image:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             emailVerified:
 *               type: boolean
 */

/**
 * @swagger
 * /v1/auth/session:
 *   get:
 *     summary: Get current user session
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Session data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionData'
 *       401:
 *         description: Unauthorized - No valid session
 */
router.get('/session', authController.getSession);

/**
 * @swagger
 * /v1/auth/sign-in:
 *   post:
 *     summary: Sign in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign in successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/sign-in', authController.signIn);

/**
 * @swagger
 * /v1/auth/sign-up:
 *   post:
 *     summary: Sign up with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sign up successful
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/sign-up', authController.signUp);

/**
 * @swagger
 * /v1/auth/sign-out:
 *   post:
 *     summary: Sign out current user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Sign out successful
 */
router.post('/sign-out', betterAuthProtect, authController.signOut);

// Note: forgot-password and reset-password are handled directly by better-auth
// They are available at /v1/auth/forget-password and /v1/auth/reset-password

export default router;
