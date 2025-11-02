/**
 * Mendefinisikan tipe umum dari sebuah aset untuk memudahkan kategorisasi.
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
 * Pemetaan dari GeneralAssetType ke nama ikon yang sesuai.
 * Kunci adalah GeneralAssetType, dan nilainya adalah string nama ikon.
 */
export const iconMapping: Readonly<Record<GeneralAssetType, string>> = {
  [GeneralAssetType.IMAGE]: 'ri:multi-image-line',
  [GeneralAssetType.VIDEO]: 'ri:video-on-line',
  [GeneralAssetType.AUDIO]: 'ri:music-line',
  [GeneralAssetType.DOCUMENT]: 'ri:file-2-line',
  [GeneralAssetType.UNKNOWN]: 'ri:file-warning-line',
};

/**
 * Pemetaan dari MIME type spesifik ke GeneralAssetType.
 * Kunci adalah string MIME type, dan nilainya adalah enum GeneralAssetType.
 */
export const mimeTypeMapping: Readonly<Record<string, GeneralAssetType>> = {
  // --- Gambar (Image) ---
  'image/jpeg': GeneralAssetType.IMAGE,
  'image/png': GeneralAssetType.IMAGE,
  'image/gif': GeneralAssetType.IMAGE,
  'image/svg+xml': GeneralAssetType.IMAGE,
  'image/webp': GeneralAssetType.IMAGE,
  'image/bmp': GeneralAssetType.IMAGE,
  'image/tiff': GeneralAssetType.IMAGE,

  // --- Video ---
  'video/mp4': GeneralAssetType.VIDEO,
  'video/webm': GeneralAssetType.VIDEO,
  'video/ogg': GeneralAssetType.VIDEO,
  'video/mpeg': GeneralAssetType.VIDEO,
  'video/quicktime': GeneralAssetType.VIDEO, // .mov
  'video/x-msvideo': GeneralAssetType.VIDEO, // .avi
  'video/x-flv': GeneralAssetType.VIDEO,
  'video/x-matroska': GeneralAssetType.VIDEO, // .mkv

  // --- Musik (Audio) ---
  'audio/mpeg': GeneralAssetType.AUDIO, // .mp3
  'audio/ogg': GeneralAssetType.AUDIO,
  'audio/wav': GeneralAssetType.AUDIO,
  'audio/aac': GeneralAssetType.AUDIO,
  'audio/webm': GeneralAssetType.AUDIO,
  'audio/flac': GeneralAssetType.AUDIO,
  'audio/midi': GeneralAssetType.AUDIO,

  // --- Dokumen (Document) ---
  'application/pdf': GeneralAssetType.DOCUMENT,

  // Microsoft Office (Legacy)
  'application/msword': GeneralAssetType.DOCUMENT, // .doc
  'application/vnd.ms-excel': GeneralAssetType.DOCUMENT, // .xls
  'application/vnd.ms-powerpoint': GeneralAssetType.DOCUMENT, // .ppt

  // Microsoft Office (OpenXML)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    GeneralAssetType.DOCUMENT, // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    GeneralAssetType.DOCUMENT, // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    GeneralAssetType.DOCUMENT, // .pptx

  // Teks dan Lainnya
  //   "text/plain": GeneralAssetType.DOCUMENT, // .txt
  //   "text/csv": GeneralAssetType.DOCUMENT,
  //   "text/html": GeneralAssetType.DOCUMENT,
  //   "application/json": GeneralAssetType.DOCUMENT,
  //   "application/xml": GeneralAssetType.DOCUMENT,

  // Arsip
  //   "application/zip": GeneralAssetType.DOCUMENT,
  //   "application/x-rar-compressed": GeneralAssetType.DOCUMENT,
  //   "application/x-7z-compressed": GeneralAssetType.DOCUMENT,
};

export const supportedMimeTypes = Object.keys(mimeTypeMapping);

/**
 * Fungsi utilitas untuk mendapatkan tipe general dari sebuah MIME type.
 * @param mimeType String MIME type dari file (contoh: 'image/png').
 * @returns GeneralAssetType yang sesuai, atau UNKNOWN jika tidak ditemukan.
 */
export function getAssetTypeFromMime(mimeType: string): GeneralAssetType {
  return mimeTypeMapping[mimeType.toLowerCase()] || GeneralAssetType.UNKNOWN;
}

/**
 * Fungsi utilitas untuk mendapatkan ikon yang sesuai dari sebuah MIME type.
 * @param mimeType String MIME type dari file (contoh: 'image/png').
 * @returns Nama ikon yang sesuai, atau ikon UNKNOWN jika tidak ditemukan.
 */
export function getIconForMimeType(mimeType: string): string {
  const assetType = getAssetTypeFromMime(mimeType);
  return iconMapping[assetType] || iconMapping[GeneralAssetType.UNKNOWN];
}

/**
 * Fungsi utilitas untuk memeriksa apakah sebuah MIME type adalah gambar.
 * @param mimeType String MIME type dari file (contoh: 'image/png').
 * @returns true jika MIME type adalah gambar, false jika tidak.
 */
export function isImageMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === GeneralAssetType.IMAGE;
}

/**
 * Fungsi utilitas untuk memeriksa apakah sebuah MIME type adalah video.
 * @param mimeType String MIME type dari file (contoh: 'video/mp4').
 * @returns true jika MIME type adalah video, false jika tidak.
 */
export function isVideoMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === GeneralAssetType.VIDEO;
}

/**
 * Fungsi utilitas untuk memeriksa apakah sebuah MIME type adalah audio.
 * @param mimeType String MIME type dari file (contoh: 'audio/mpeg').
 * @returns true jika MIME type adalah audio, false jika tidak.
 */
export function isAudioMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === GeneralAssetType.AUDIO;
}

/**
 * Fungsi utilitas untuk memeriksa apakah sebuah MIME type adalah dokumen.
 * @param mimeType String MIME type dari file (contoh: 'application/pdf').
 * @returns true jika MIME type adalah dokumen, false jika tidak.
 */
export function isDocumentMimeType(mimeType: string): boolean {
  return getAssetTypeFromMime(mimeType) === GeneralAssetType.DOCUMENT;
}
