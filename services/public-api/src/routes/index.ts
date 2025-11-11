import { Router } from 'express';

import * as AssetController from '../controllers/asset.controller';

const router = Router();

/**
 * @swagger
 * /v1/{slugFolder}:
 *   get:
 *     summary: Get all assets in a folder
 *     description: Returns a list of assets contained within the specified folder.
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: slugFolder
 *         required: true
 *         description: Folder slug
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         required: false
 *         description: Filter assets by type (e.g., image, video)
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of assets
 *       '404':
 *         description: Folder not found
 *       '500':
 *         description: Server error
 */
router.get('/:slugFolder', AssetController.getAssetsByFolder);

/**
 * @swagger
 * /v1/{slugFolder}/{slugAsset}:
 *   get:
 *     summary: Redirect to asset URL (Cloudinary)
 *     description: Redirects to the Cloudinary URL for the specified asset.
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: slugFolder
 *         required: true
 *         description: Folder slug
 *         schema:
 *           type: string
 *       - in: path
 *         name: slugAsset
 *         required: true
 *         description: Asset slug
 *         schema:
 *           type: string
 *     responses:
 *       '302':
 *         description: Redirect to the asset URL
 *       '404':
 *         description: Asset not found
 *       '500':
 *         description: Server error
 */
router.get('/:slugFolder/:slugAsset', AssetController.redirectToAsset);

export default router;
