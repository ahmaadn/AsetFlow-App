import { httpUploadSchema } from '@asetflow/validators';
import { Router } from 'express';

import uploadController from '../controllers/upload.controller.js';
import { authenticateUserWithRoles } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/muler.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

export function createUploadRoutes(): Router {
  const router: Router = Router();
  router.use(authenticateUserWithRoles(['ADMIN', 'USER']));

  /**
   * @swagger
   * /v1/folders/{id}/upload:
   *   post:
   *     summary: Upload file ke folder
   *     description: Menerima multipart/form-data dengan field "file".
   *     operationId: uploadFile
   *     tags: [Upload]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - $ref: '#/components/parameters/FolderIdParam'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             $ref: '#/components/schemas/UpdateFolderRequest'
   *     responses:
   *       201:
   *         $ref: '#/components/responses/AssetItemResponse'
   *       4xx:
   *         $ref : '#/components/responses/ApiError'
   *       400:
   *         description: Validasi gagal atau payload tidak sesuai
   *       401:
   *         $ref : '#/components/responses/UnauthorizedError'
   *       413:
   *         description: Ukuran file terlalu besar
   *       415:
   *         description: Tipe media tidak didukung
   *       422:
   *         $ref : '#/components/responses/ValidationError'
   *       500:
   *         $ref : '#/components/responses/ApiError'
   */
  router.post(
    '/:id/upload',
    uploadMiddleware.single('file'),
    validate(httpUploadSchema),
    uploadController.handleFileUpload.bind(uploadController)
  );
  return router;
}
export default createUploadRoutes;
