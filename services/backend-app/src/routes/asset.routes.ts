import {
  httpUpdateAssetSchema,
  httpParamsAssetSchema,
  httpGetAssetsByTypeSchema,
} from '@asetflow/validators';
import { Router } from 'express';

import assetController from '../controllers/asset.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

export function createAssetRoutes(): Router {
  const router: Router = Router();

  router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

  /**
   * @swagger
   * /v1/assets/{id}:
   *   put:
   *     summary: Update an asset
   *     tags: [Assets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/AssetIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAssetRequest'
   *     responses:
   *       200:
   *         $ref: '#/components/responses/AssetItemResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.put(
    '/:id',
    validate(httpUpdateAssetSchema),
    assetController.updateAsset.bind(assetController)
  );

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
   *       - $ref: '#/components/parameters/AssetIdParam'
   *     responses:
   *       204:
   *         $ref : '#/components/responses/NoContentResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.delete(
    '/:id',
    validate(httpParamsAssetSchema),
    assetController.deleteAsset.bind(assetController)
  );

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
   *       - $ref: '#/components/parameters/AssetIdParam'
   *     responses:
   *       200:
   *         $ref: '#/components/responses/AssetItemResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.get(
    '/:id',
    validate(httpParamsAssetSchema),
    assetController.getAssetById.bind(assetController)
  );

  /**
   * @swagger
   * /v1/assets:
   *   get:
   *     summary: Get all assets by type
   *     tags: [Assets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/QueryPageParam'
   *       - $ref: '#/components/parameters/QueryPerPageParam'
   *       - $ref: '#/components/parameters/QueryAssetTypeParam'
   *       - $ref: '#/components/parameters/QueryAssetSortByParam'
   *       - $ref: '#/components/parameters/QueryOrderParam'
   *     responses:
   *       200:
   *         $ref : '#/components/responses/PaginationListAssetResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.get(
    '',
    validate(httpGetAssetsByTypeSchema),
    assetController.getAssetsByType.bind(assetController)
  );

  return router;
}

export default createAssetRoutes;
