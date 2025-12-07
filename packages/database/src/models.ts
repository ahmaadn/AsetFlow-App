import type {
  Asset,
  Account,
  AssetTag,
  Folder,
  FolderTag,
  Tag,
  Session,
  User,
  Verification,
} from '@prisma/client';

export type UserModel = User;
export type SessionModel = Session;
export type TagModel = Tag;
export type FolderModel = Folder;
export type AssetModel = Asset;
export type FolderTagModel = FolderTag;
export type AssetTagModel = AssetTag;
export type AccountModel = Account;
export type VerificationModel = Verification;
