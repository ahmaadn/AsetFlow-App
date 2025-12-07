import { httpUpload } from '@asetflow/validators';
import { Router } from 'express';

import * as UploadController from '../controllers/upload.controller.js';
import { betterAuthProtect } from '../middleware/auth.middleware.js';
import { uploadMiddleware } from '../middleware/muler.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router: Router = Router();
router.use(betterAuthProtect);

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
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID folder tujuan penyimpanan berkas
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               filename:
 *                 type: string
 *                 description: Ganti nama file saat disimpan
 *               slug:
 *                 type: string
 *                 description: Slug kustom untuk file yang diunggah
 *     responses:
 *       '201':
 *         description: Berhasil mengunggah file
 *       '400':
 *         description: Validasi gagal atau payload tidak sesuai
 *       '401':
 *         description: Tidak terotorisasi
 *       '413':
 *         description: Ukuran file terlalu besar
 *       '415':
 *         description: Tipe media tidak didukung
 *       '500':
 *         description: Kesalahan server
 */
router.post(
  '/:id/upload',
  uploadMiddleware.single('file'),
  validate(httpUpload),
  UploadController.handleFileUpload
);

export default router;
