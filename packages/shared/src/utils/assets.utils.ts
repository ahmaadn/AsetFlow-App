import {
  DEFAULT_ICONS,
  MAX_UPLOAD_SIZE_BYTES,
  MIME_TYPE_REGISTRY,
  SUPPORTED_MIME_TYPES,
} from '../config';
import { formatSize } from './formatter.utils';
import type {
  GeneralAssetType,
  IconIdentifier,
  MimeTypeConfig,
} from '../types/assets.types';

/**
 * Normalisasi MIME type untuk konsistensi
 */
function normalizeMimeType(mimeType: string): string {
  return mimeType.trim().toLowerCase();
}

/**
 * Validasi input MIME type
 */
function isValidMimeType(mimeType: unknown): mimeType is string {
  return typeof mimeType === 'string' && mimeType.trim().length > 0;
}

/**
 * Build optimized lookup map saat module load
 */
const MIME_TYPE_MAP = (() => {
  const map = new Map<string, MimeTypeConfig>();

  Object.entries(MIME_TYPE_REGISTRY).forEach(([mimeType, config]) => {
    const normalized = normalizeMimeType(mimeType);
    if (map.has(normalized)) {
      console.warn(`[MIME] Duplicate MIME type detected: ${normalized}`);
    }
    map.set(normalized, config);
  });

  return map;
})();

/**
 * Export supported MIME types untuk validation
 */
export const supportedMimeTypes: ReadonlyArray<string> = Array.from(
  MIME_TYPE_MAP.keys()
);

/**
 * Get asset type dari MIME type
 */
export function getAssetTypeFromMime(mimeType: string): GeneralAssetType {
  if (!isValidMimeType(mimeType)) {
    return 'unknown';
  }

  const normalized = normalizeMimeType(mimeType);
  const config = MIME_TYPE_MAP.get(normalized);

  return config?.type ?? 'unknown';
}

/**
 * Detect asset type dari MIME type prefix (fallback method)
 */
function detectAssetTypeFromPrefix(mimeType: string): GeneralAssetType {
  const prefix = mimeType.split('/')[0];

  switch (prefix) {
    case 'image':
      return 'image';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    case 'application':
    case 'text':
      return 'document';
    default:
      return 'unknown';
  }
}

/**
 * Get icon untuk MIME type spesifik
 */
export function getIconForMimeType(mimeType: string): IconIdentifier {
  if (!isValidMimeType(mimeType)) {
    return DEFAULT_ICONS.unknown;
  }

  const normalized = normalizeMimeType(mimeType);
  const config = MIME_TYPE_MAP.get(normalized);

  if (config) {
    return config.icon;
  }

  const assetType = detectAssetTypeFromPrefix(normalized);
  return DEFAULT_ICONS[assetType];
}

/**
 * Get icon untuk asset type (default icon)
 */
export function getIconForAssetType(
  assetType: GeneralAssetType
): IconIdentifier {
  return DEFAULT_ICONS[assetType];
}

/**
 * Type guards - Pure functions
 */
export function isImageMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === 'image';
}

export function isVideoMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === 'video';
}

export function isAudioMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === 'audio';
}

export function isDocumentMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === 'document';
}

export function isSupportedMimeType(mimeType: string): boolean {
  if (!isValidMimeType(mimeType)) {
    return false;
  }
  return MIME_TYPE_MAP.has(normalizeMimeType(mimeType));
}

/**
 * Get all MIME types untuk specific asset type
 */
export function getMimeTypesForAssetType(
  assetType: GeneralAssetType
): ReadonlyArray<string> {
  return Array.from(MIME_TYPE_MAP.entries())
    .filter(([, config]) => config.type === assetType)
    .map(([mimeType]) => mimeType);
}

/**
 * Validasi Assets sebelum diupload
 * @param file
 */
export function validateAssets(file: File) {
  // validasi ukuran file
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    // You can use your own notification system here

    throw new Error(
      `File size exceeds the maximum limit of ${formatSize(
        MAX_UPLOAD_SIZE_BYTES
      )}.`
    );
  }

  //   validasi tipe file
  if (
    SUPPORTED_MIME_TYPES.length > 0 &&
    !SUPPORTED_MIME_TYPES.includes('*/*')
  ) {
    const isValidType = SUPPORTED_MIME_TYPES.some((type) => {
      if (type.endsWith('/*')) {
        // handle wildcard, misal image/*
        const mainType = type.split('/')[0];
        return file.type.startsWith(mainType + '/');
      }
      return file.type === type;
    });
    if (!isValidType) {
      throw new Error(`File type ${file.type} is not supported.`);
    }
  }
}
