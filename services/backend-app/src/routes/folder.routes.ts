import {
  httpCheckFolderSchema,
  httpCreateFolderSchema,
  httpFoldersQuerySchema,
  httpGetAssetsSchema,
  httpUpdateFolderSchema,
} from '@asetflow/validators';
import { Router } from 'express';

import assetController from '../controllers/asset.controller.js';
import folderController from '../controllers/folder.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

export function createFolderRoutes(): Router {
  const router: Router = Router();
  router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

  /**
   * @swagger
   * /v1/folders:
   *   get:
   *     summary: Get all folders
   *     tags:  [Folders]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref : '#/components/parameters/QueryPageParam'
   *       - $ref : '#/components/parameters/QueryPerPageParam'
   *       - $ref : '#/components/parameters/QuerySearchParam'
   *       - $ref : '#/components/parameters/QueryFolderSortByParam'
   *       - $ref : '#/components/parameters/QueryOrderParam'
   *     responses:
   *       200:
   *         $ref : '#/components/responses/PaginationFolderResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.get(
    '/',
    validate(httpFoldersQuerySchema),
    folderController.getAllFolders.bind(folderController)
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
   *             $ref: '#/components/schemas/CreateFolderItem'
   *    responses:
   *       201:
   *         $ref : '#/components/responses/DetailFolderResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post(
    '/',
    validate(httpCreateFolderSchema),
    folderController.createFolder.bind(folderController)
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
   *      - $ref: '#/components/parameters/FolderIdParam'
   *    requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateFolderItem'
   *    responses:
   *       200:
   *         $ref : '#/components/responses/DetailFolderResponse'
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.put(
    '/:id',
    validate(httpUpdateFolderSchema),
    folderController.updateFolder.bind(folderController)
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
   *      - $ref: '#/components/parameters/FolderIdParam'
   *    responses:
   *      204:
   *        $ref : '#/components/responses/NoContentResponse'
   *      401:
   *        $ref : '#/components/responses/UnauthorizedError'
   *      422:
   *        $ref : '#/components/responses/ValidationError'
   *      500:
   *        $ref : '#/components/responses/ApiError'
   */
  router.delete(
    '/:id',
    validate(httpCheckFolderSchema),
    folderController.deleteFolder.bind(folderController)
  );

  /**
   * @swagger
   * /v1/folders/check/{id}:
   *  head:
   *    summary: Check if a Folder exists
   *    tags: [Folders]
   *    security:
   *      - bearerAuth: []
   *    parameters:
   *      - $ref: '#/components/parameters/FolderIdParam'
   *    responses:
   *      200:
   *        $ref : '#/components/responses/NoContentResponse'
   *      401:
   *        $ref : '#/components/responses/UnauthorizedError'
   *      404:
   *        $ref : '#/components/responses/NoContentResponse'
   *      422:
   *        $ref : '#/components/responses/ValidationError'
   *      500:
   *        $ref : '#/components/responses/ApiError'
   */
  router.head(
    '/check/:id',
    validate(httpCheckFolderSchema),
    folderController.checkFolderExists.bind(folderController)
  );

  /**
   * @swagger
   * /v1/folders/{id}/assets:
   *   get:
   *     summary: Get all assets in a folder
   *     tags: [Assets]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/FolderIdParam'
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
    '/:id/assets',
    validate(httpGetAssetsSchema),
    assetController.getAssetsByFolder.bind(assetController)
  );

  return router;
}

export default createFolderRoutes;
