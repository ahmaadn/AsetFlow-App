import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * Format tanggal menjadi "time ago" jika kurang dari 1 hari,
 * atau "dd-MM-yyyy" jika lebih dari 1 hari.
 * @param dateInput Tanggal dalam format string (ISO) atau objek Date
 * @returns String tanggal yang sudah diformat
 */
export const formatDisplayDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';

  const date = dayjs(dateInput);
  const now = dayjs();

  // Hitung perbedaan waktu dalam milidetik
  const diffMs = now.diff(date);

  if (diffMs > ONE_DAY_IN_MS) {
    return date.format('DD-MM-YYYY');
  } else {
    return date.fromNow();
  }
};
