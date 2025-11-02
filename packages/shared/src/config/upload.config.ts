import type {
  GeneralAssetType,
  IconIdentifier,
  MimeTypeConfig,
} from '../types/assets.types';

/**
 * Maksimum ukuran unggahan berkas.
 */
export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Maksimum jumlah unggahan berkas yang dapat dilakukan secara bersamaan.
 */
export const MAX_CONCURRENT_UPLOADS = 3;

/**
 * Default icons untuk setiap asset type
 * Digunakan sebagai fallback jika MIME type tidak terdaftar
 */
export const DEFAULT_ICONS: Record<GeneralAssetType, IconIdentifier> = {
  image: 'ri:image-line',
  video: 'ri:video-line',
  audio: 'ri:music-line',
  document: 'ri:file-text-line',
  unknown: 'ri:file-warning-line',
} as const;

/**
 * Registry untuk MIME types dengan icon spesifik
 * Setiap MIME type bisa punya icon unik, jika tidak diset akan pakai DEFAULT_ICONS
 */
export const MIME_TYPE_REGISTRY: Record<string, MimeTypeConfig> = {
  // ===========================================
  // IMAGES - Gambar
  // ===========================================
  'image/jpeg': { type: 'image', icon: 'ri:image-line' },
  'image/jpg': { type: 'image', icon: 'ri:image-line' },
  'image/png': { type: 'image', icon: 'ri:image-line' },
  'image/gif': { type: 'image', icon: 'ri:image-line' },
  'image/webp': { type: 'image', icon: 'ri:image-line' },
  'image/bmp': { type: 'image', icon: 'ri:image-line' },
  'image/tiff': { type: 'image', icon: 'ri:image-line' },
  'image/svg+xml': { type: 'image', icon: 'ri:code-line' },

  // ===========================================
  // VIDEOS - Video
  // ===========================================
  'video/mp4': { type: 'video', icon: 'ri:movie-line' },
  'video/webm': { type: 'video', icon: 'ri:movie-line' },
  'video/ogg': { type: 'video', icon: 'ri:movie-line' },
  'video/mpeg': { type: 'video', icon: 'ri:movie-line' },
  'video/quicktime': { type: 'video', icon: 'ri:movie-line' }, // .mov
  'video/x-msvideo': { type: 'video', icon: 'ri:movie-line' }, // .avi
  'video/x-flv': { type: 'video', icon: 'ri:movie-line' },
  'video/x-matroska': { type: 'video', icon: 'ri:movie-line' }, // .mkv

  // ===========================================
  // AUDIOS - Audio/Musik
  // ===========================================
  'audio/mpeg': { type: 'audio', icon: 'ri:music-2-line' }, // .mp3
  'audio/mp3': { type: 'audio', icon: 'ri:music-2-line' },
  'audio/ogg': { type: 'audio', icon: 'ri:music-2-line' },
  'audio/aac': { type: 'audio', icon: 'ri:music-2-line' },
  'audio/webm': { type: 'audio', icon: 'ri:music-2-line' },
  'audio/flac': { type: 'audio', icon: 'ri:music-2-line' },
  'audio/midi': { type: 'audio', icon: 'ri:music-2-line' },
  'audio/wav': { type: 'audio', icon: 'ri:waveform-line' },

  // ===========================================
  // DOCUMENTS - Dokumen
  // ===========================================

  // PDF
  'application/pdf': { type: 'document', icon: 'ri:file-pdf-line' },

  // Microsoft Word
  'application/msword': { type: 'document', icon: 'ri:file-word-line' }, // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    type: 'document',
    icon: 'ri:file-word-line', // .docx
  },

  // Microsoft Excel
  'application/vnd.ms-excel': {
    type: 'document',
    icon: 'ri:file-excel-line',
  }, // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    type: 'document',
    icon: 'ri:file-excel-line', // .xlsx
  },

  // Microsoft PowerPoint
  'application/vnd.ms-powerpoint': {
    type: 'document',
    icon: 'ri:file-ppt-line',
  }, // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
    type: 'document',
    icon: 'ri:file-ppt-line', // .pptx
  },
} as const;

/**
 * Export supported MIME types sebagai array readonly
 */
export const SUPPORTED_MIME_TYPES: ReadonlyArray<string> =
  Object.keys(MIME_TYPE_REGISTRY);
