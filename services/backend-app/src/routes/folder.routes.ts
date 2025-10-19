import { Router } from 'express';

import * as FolderController from '../controllers/folder.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { getFoldersSchema } from '../schemas/folder.schema';

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

export default router;
