import { MAX_UPLOAD_SIZE_BYTES, SUPPORTED_MIME_TYPES } from '@asetflow/shared';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { BadRequestError } from '../utils/api-error.js';

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError({
        message: 'Invalid file type. Unsupported MIME type.',
      })
    );
  }
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  fileFilter: fileFilter,
});
