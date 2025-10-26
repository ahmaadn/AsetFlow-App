import {
  httpCreateFolder,
  httpDeleteFolder,
  httpFoldersQuery,
  httpUpdateFolder,
} from '@asetflow/validators';
import { Router } from 'express';

import * as FolderController from '../controllers/folder.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

/**
 * @swagger
 * /v1/folders:
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
  validate(httpFoldersQuery),
  FolderController.getAllFolder
);

/**
 * @swagger
 * /v1/folders:
 *  post:
 *    summary: Create a Folder
 *    tags: [Folders]
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
 *               slug:
 *                 type: string
 *                 nullable: true
 *                 example: "designs"
 *    responses:
 *      201:
 *        description: Folder created successfully
 */
router.post(
  '/',
  protect,
  validate(httpCreateFolder),
  FolderController.createFolder
);

/**
 * @swagger
 * /v1/folders/{id}:
 *  put:
 *    summary: Update a Folder
 *    tags: [Folders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         format: uuid
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
 *               slug:
 *                 type: string
 *                 nullable: true
 *                 example: "designs"
 *    responses:
 *      201:
 *        description: Folder updated successfully
 */
router.put(
  '/:id',
  protect,
  validate(httpUpdateFolder),
  FolderController.updateFolder
);

/**
 * @swagger
 * /v1/folders/{id}:
 *  delete:
 *    summary: Delete a Folder
 *    tags: [Folders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         format: uuid
 *    responses:
 *      204:
 *        description: Folder deleted successfully
 */
router.delete(
  '/:id',
  protect,
  validate(httpDeleteFolder),
  FolderController.deleteFolder
);

export default router;
