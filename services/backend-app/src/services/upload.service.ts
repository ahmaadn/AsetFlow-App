import { UserModel } from '@asetflow/database';
import { AsetResponse } from '@asetflow/shared-types';
import { type Express } from 'express';

import * as AssetRepository from '../repositories/aset.repository';
import * as FolderRepository from '../repositories/folder.repository';
import { NotFoundError } from '../utils/api-error';
import { uploadToCloudinary } from '../utils/cloudinary';

export const uploadAset = async (
  folderId: string,
  user: UserModel,
  file: Express.Multer.File,
  filename: string,
  slug: string | undefined
): Promise<AsetResponse> => {
  // Cek folder
  const folder = await FolderRepository.findById(folderId);
  if (!folder) {
    throw new NotFoundError({
      message: `Folder with ID "${folderId}" does not exist.`,
    });
  }

  // buat slug jika tidak ada
  // Gunakan format: nama-file-tanpa-ekstensi-timestamp
  if (!slug) {
    slug =
      filename
        .split('.')
        .slice(0, -1)
        .join('.')
        .toLowerCase()
        .replace(/\s+/g, '-') +
      '-' +
      Date.now();
  }

  // Upload file ke Cloudinary
  const result = await uploadToCloudinary(
    file.buffer,
    filename,
    `asetflow/${folder.slug}`,
    slug
  );

  // simpan
  const aset = await AssetRepository.create({
    folderId: folder.id,
    ownerId: user.id,
    publicId: result.public_id,
    originalName: filename,
    slug: slug,
    size: file.size.toString(),
    mimeType: file.mimetype,
    assetType: result.resource_type,
    url: result.secure_url,
    format: result.format,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
  });

  return {
    id: aset.id,
    folderId: aset.folderId,
    ownerId: aset.ownerId,
    publicId: aset.publicId,
    originalName: aset.originalName,
    slug: aset.slug,
    size: aset.size,
    mimeType: aset.mimeType,
    assetType: aset.assetType,
    url: aset.url,
    format: aset.format,
    resourceType: aset.resourceType,
    width: aset.width,
    height: aset.height,
    createdAt: aset.createdAt.toISOString(),
    updatedAt: aset.updatedAt.toISOString(),
  };
};
