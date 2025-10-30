import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { BadRequestError } from '../utils/api-error';

// Tentukan tipe file yang diizinkan
const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'image/gif',
];

// Batas ukuran file (10 MB)
const MAX_SIZE = 10 * 1024 * 1024;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError({
        message: 'Invalid file type. Only images and PDFs are allowed.',
      })
    );
  }
};

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: fileFilter,
});
