import { getAssetTypeFromMime } from '@asetflow/shared';
import { MetadataAsset } from '@asetflow/shared-types';
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

/**
 * Mengekstrak metadata dari response Cloudinary berdasarkan tipe MIME
 * @param mimeType Tipe MIME dari file
 * @param result Response dari Cloudinary setelah upload
 * @returns MetadataAsset
 */
export const extactMetadataFromCloudinary = (
  mimeType: string,
  result: UploadApiResponse
): MetadataAsset => {
  const typeAsset = getAssetTypeFromMime(mimeType);

  const metadata: Record<string, unknown> = {
    resource_type: result.resource_type,
    version: result.version,
  };

  if (typeAsset === 'image') {
    metadata.width = result.width || null;
    metadata.height = result.height || null;
  } else if (typeAsset === 'video') {
    metadata.width = result.width;
    metadata.height = result.height;
    metadata.duration = result.duration;
    metadata.bit_rate = result.bit_rate;
    metadata.frame_rate = result.frame_rate;
  } else if (typeAsset === 'audio') {
    metadata.duration = result.duration;
    metadata.bit_rate = result.bit_rate;
  } else if (typeAsset === 'document') {
    // Untuk dokumen, Cloudinary tidak menyediakan metadata khusus
    // Namun, kita bisa menambahkan halaman jika tersedia
    if (result.pages) {
      metadata.pages = result.pages;
    }
  }

  return metadata as unknown as MetadataAsset;
};
