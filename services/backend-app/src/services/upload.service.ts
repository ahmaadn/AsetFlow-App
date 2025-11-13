import { UserModel } from '@asetflow/database';
import {
  generateSlug,
  getAssetTypeFromMime,
  getExtension,
} from '@asetflow/shared';
import { AssetResponse } from '@asetflow/shared-types';

import { CLOUDINARY_ROOT_FOLDER } from '../configs/cloudinary.config';
import * as AssetRepository from '../repositories/asset.repository';
import * as FolderRepository from '../repositories/folder.repository';
import { NotFoundError } from '../utils/api-error';
import { uploadToCloudinary } from '../utils/cloudinary';

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

  // simpan
  const asset = await AssetRepository.create({
    folderId: folder.id,
    ownerId: user.id,
    publicId: result.public_id,
    originalName: filename,
    slug: slug,
    size: file.size.toString(),
    mimeType: file.mimetype,
    assetType: getAssetTypeFromMime(file.mimetype),
    url: result.secure_url,
    format: result.format || getExtension(filename),
    width: result.width || 0, //
    height: result.height || 0,
  });

  return {
    id: asset.id,
    folderId: asset.folderId,
    ownerId: asset.ownerId,
    publicId: asset.publicId,
    originalName: asset.originalName,
    slug: asset.slug,
    size: asset.size,
    mimeType: asset.mimeType,
    assetType: asset.assetType,
    url: asset.url,
    format: asset.format,
    viewCount: asset.viewCount,
    width: asset.width,
    height: asset.height,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
};
