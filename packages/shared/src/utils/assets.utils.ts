import { DEFAULT_ICONS, MIME_TYPE_REGISTRY } from '../config';
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
