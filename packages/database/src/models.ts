import type {
  Asset,
  AssetTag,
  Folder,
  FolderTag,
  Tag,
  User,
  Verification,
  UserRole,
  RefreshToken,
  VerificationType,
} from '../prisma/generated/client';

export type UserModel = User;
export type TagModel = Tag;
export type FolderModel = Folder;
export type AssetModel = Asset;
export type FolderTagModel = FolderTag;
export type AssetTagModel = AssetTag;
export type VerificationModel = Verification;

export type RefreshTokenModel = RefreshToken;

export type { UserRole, VerificationType };
