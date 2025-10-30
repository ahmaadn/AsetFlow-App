import { UploadApiOptions, UploadApiResponse } from 'cloudinary';

import { InternalServerError } from './api-error';
import cloudinary from '../configs/cloudinary.config';

/**
 * Meng-upload file (dari buffer) ke Cloudinary
 * @param fileBuffer Buffer file dari Multer
 * @param fileName Nama file asli (untuk ekstensi)
 * @param folder Folder tujuan di Cloudinary
 * @param publicId Opsional public_id kustom (bisa dari slug)
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  fileName: string,
  folder: string,
  publicId?: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    // Tentukan public_id
    // Jika ada slug, gunakan slug. Jika tidak, gunakan nama file asli tanpa ekstensi
    const options: UploadApiOptions = {
      folder: folder,
      resource_type: 'auto',
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true;
    } else {
      // Dapatkan nama file tanpa ekstensi
      options.public_id = fileName.split('.').slice(0, -1).join('.');
    }

    // Buat stream upload ke Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(
            new InternalServerError({
              message: `Cloudinary upload error: ${error.message}`,
            })
          );
        }
        if (result) {
          resolve(result);
        } else {
          reject(
            new InternalServerError({
              message: 'Cloudinary upload failed, no result returned.',
            })
          );
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
