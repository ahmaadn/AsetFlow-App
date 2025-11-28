import {
  httpUpdateAsset,
  httpParamsAsset,
  httpGetAssetsByType,
} from '@asetflow/validators';
import { Router } from 'express';

import * as AssetController from '../controllers/asset.controller';
import { betterAuthProtect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

router.use(betterAuthProtect);

/**
 * @swagger
 * /v1/assets/{id}:
 *   put:
 *     summary: Update an asset
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalName:
 *                 type: string
 *                 example: "Updated Image Name"
 *               slug:
 *                 type: string
 *                 example: "updated-image-name"
 *     responses:
 *       200:
 *         description: Asset updated successfully
 */
router.put('/:id', validate(httpUpdateAsset), AssetController.updateAsset);

/**
 * @swagger
 * /v1/assets/{id}:
 *   delete:
 *     summary: Delete an asset
 *     description: Permanently delete an asset by its ID
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the asset to delete
 *     responses:
 *       204:
 *         description: Asset deleted successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', validate(httpParamsAsset), AssetController.deleteAsset);

/**
 * @swagger
 * /v1/assets/{id}:
 *   get:
 *     summary: Get asset by ID
 *     description: Retrieve an asset by its ID
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the asset to retrieve
 *     responses:
 *       204:
 *         description: Asset deleted successfully
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', validate(httpParamsAsset), AssetController.getAssetById);

/**
 * @swagger
 * /v1/assets:
 *   get:
 *     summary: Get all assets by type
 *     tags: [Assets]
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
 *         description: Number of items per page
 *       - in: query
 *         name: assetType
 *         schema:
 *           type: string
 *         description: Filter by asset type (image, video, etc)
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [createdAt, name, size]
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: A list of assets
 */
router.get('', validate(httpGetAssetsByType), AssetController.getAssetsByType);

export default router;
