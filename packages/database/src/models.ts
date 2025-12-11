import type {
  Asset,
  AssetTag,
  Folder,
  FolderTag,
  Tag,
  User,
  Verification,
} from '../prisma/generated/client';

export type UserModel = User;
export type TagModel = Tag;
export type FolderModel = Folder;
export type AssetModel = Asset;
export type FolderTagModel = FolderTag;
export type AssetTagModel = AssetTag;
export type VerificationModel = Verification;
