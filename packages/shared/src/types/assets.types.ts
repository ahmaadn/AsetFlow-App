/**
 * Enum untuk tipe umum aset yang didukung sistem.
 */
export const GeneralAssetType = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
  UNKNOWN: 'unknown',
} as const;

export type GeneralAssetType =
  (typeof GeneralAssetType)[keyof typeof GeneralAssetType];

/**
 * Type-safe icon identifier
 */
export type IconIdentifier = string;

/**
 * Konfigurasi untuk setiap MIME type
 */
export interface MimeTypeConfig {
  readonly type: GeneralAssetType;
  readonly icon: IconIdentifier;
}
