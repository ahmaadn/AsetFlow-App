import { Router } from 'express';

import * as FolderController from '../controllers/folder.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createFolderSchema, getFoldersSchema } from '../schemas/folder.schema';

const router = Router();

/**
 * @swagger
 * /v1/folder/:
 *   get:
 *     summary: Get all folders
 *     tags:  [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *         description: Number of items per page for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering folders
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *
 *     responses:
 *       200:
 *         description: A list of folders
 */
router.get(
  '/',
  protect,
  validate(getFoldersSchema),
  FolderController.getAllFolder
);

/**
 * @swagger
 * /v1/folder
 *  post:
 *    summary: Create a Folder
 *    tags: [folder]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Designs"
 *               parentId:
 *                 type: string
 *                 nullable: true
 *                 example: "60b7c0f2e1d3c8a1f0a1b2c3"
 *               description:
 *                 type: string
 *                 example: "Folder for design assets"
 *    responses:
 *      201:
 *        description: Folder created successfully
 */
router.post(
  '/',
  protect,
  validate(createFolderSchema),
  FolderController.createFolder
);

export default router;
