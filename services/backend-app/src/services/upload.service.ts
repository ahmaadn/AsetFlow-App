import { type UserModel } from '@asetflow/database';
import { logger } from '@asetflow/logger';
import { generateSlug, getExtension } from '@asetflow/shared';
import type { AssetResponse, MetadataAsset } from '@asetflow/shared-types';

import { CLOUDINARY_ROOT_FOLDER } from '../configs/cloudinary.config.js';
import * as AssetRepository from '../repositories/asset.repository.js';
import * as FolderRepository from '../repositories/folder.repository.js';
import { NotFoundError } from '../utils/api-error.js';
import {
  extractMetadataFromCloudinary,
  uploadToCloudinary,
} from '../utils/cloudinary.js';

export const uploadAset = async (
  folderId: string,
  user: UserModel,
  file: Express.Multer.File,
  filename: string,
  slug: string | undefined
): Promise<AssetResponse> => {
  // Cek folder
  const folder = await FolderRepository.findById(folderId);
  if (!folder) {
    throw new NotFoundError({
      message: `Folder with ID "${folderId}" does not exist.`,
    });
  }

  const timeUpload = new Date().getTime();

  // buat slug jika tidak ada
  // Gunakan format: nama-file-tanpa-ekstensi-timestamp
  if (!slug) {
    slug = generateSlug(filename + '-' + timeUpload);
  }

  // buat random public id
  const randomPublicId = Math.random().toString(36).substring(2, 15);

  // Upload file ke Cloudinary dengan memasukkannya ke dalam folder-id,
  // folder-id di pilih karena id tidak dapat berubah
  const result = await uploadToCloudinary(
    file.buffer,
    filename,
    `${CLOUDINARY_ROOT_FOLDER}/${folder.id}`,
    `${randomPublicId}-${timeUpload}`
  );

  logger.info(
    `File uploaded to Cloudinary with public_id: ${result.public_id}`
  );
  logger.info('Result Response from Cloudinary:');
  logger.info(JSON.stringify(result, null, 2));

  const metadata = extractMetadataFromCloudinary(file.mimetype, result);

  // simpan
  const asset = await AssetRepository.create({
    folderId: folder.id,
    ownerId: user.id,
    publicId: result.public_id,
    name: filename,
    slug: slug,
    size: file.size,
    mimeType: file.mimetype,
    url: result.secure_url,
    format: result.format || getExtension(filename),
    metadata: metadata,
  });

  logger.info(`Asset record created with ID: ${asset.id}`);

  return {
    id: asset.id,
    folderId: asset.folderId,
    ownerId: asset.ownerId,
    publicId: asset.publicId,
    name: asset.name,
    slug: asset.slug,
    size: Number(asset.size),
    mimeType: asset.mimeType,
    url: asset.url,
    format: asset.format,
    viewCount: asset.viewCount,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
    metadata: asset.metadata as unknown as MetadataAsset,
  };
};
