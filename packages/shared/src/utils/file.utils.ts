/* eslint-disable no-useless-escape */
/**
 * Menghasilkan slug dari teks
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Strip extension dari filename
 */
export function stripExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0) return filename;
  return filename.slice(0, lastDot);
}

/**
 * Mengambil extension dari filename
 */
export function getExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot + 1);
}

/**
 * Truncate filename dengan mempertahankan ekstensi
 */
export function truncateFilename(filename: string, maxLength: number): string {
  if (filename.length <= maxLength) {
    return filename;
  }

  const extension = getExtension(filename);
  const nameWithoutExtension = stripExtension(filename);
  const allowedNameLength = maxLength - extension.length - 3; // 3 for "..."

  if (allowedNameLength <= 0) {
    return '...' + (extension ? '.' + extension : '');
  }

  const truncatedName = nameWithoutExtension.slice(0, allowedNameLength);
  return `${truncatedName}...${extension ? '.' + extension : ''}`;
}

/**
 * Memisahkan nama file dan ekstensi
 */
export function extractFileName(filename: string): {
  name: string;
  extension: string;
} {
  const extension = getExtension(filename);
  const name = stripExtension(filename);
  return { name, extension };
}
