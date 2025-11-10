const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const ONE_MINUTE_IN_MS = 60 * 1000;

/**
 * Format tanggal menjadi "time ago" jika kurang dari 1 hari,
 * atau "dd-MM-yyyy" jika lebih dari 1 hari.
 * @param dateInput Tanggal dalam format string (ISO) atau objek Date
 * @returns String tanggal yang sudah diformat
 */
export const formatDisplayDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const now = new Date();

  // Hitung perbedaan waktu dalam milidetik
  const diffMs = now.getTime() - date.getTime();

  let result: string;
  if (diffMs > ONE_DAY_IN_MS) {
    // Format: DD-MM-YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    result = `${day}-${month}-${year}`;
  } else {
    // Time ago format
    result = getTimeAgo(diffMs);
  }

  return result;
};

/**
 * Convert milliseconds to "time ago" format
 * @param diffMs Difference in milliseconds
 * @returns Human readable time ago string
 */
function getTimeAgo(diffMs: number): string {
  if (diffMs < ONE_MINUTE_IN_MS) {
    const seconds = Math.floor(diffMs / 1000);
    return seconds <= 1 ? 'baru saja' : `${seconds} detik yang lalu`;
  }

  if (diffMs < ONE_HOUR_IN_MS) {
    const minutes = Math.floor(diffMs / ONE_MINUTE_IN_MS);
    return `${minutes} menit yang lalu`;
  }

  const hours = Math.floor(diffMs / ONE_HOUR_IN_MS);
  return `${hours} jam yang lalu`;
}

/**
 * Format bytes into human-readable string.
 * @param bytes jumlah bytes
 * @param decimals  jumlah desimal
 * @returns
 */
export const formatSize = (bytes: number | string, decimals = 2): string => {
  if (typeof bytes === 'string') {
    bytes = parseInt(bytes, 10);
  }
  if (bytes === 0 || isNaN(bytes)) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
