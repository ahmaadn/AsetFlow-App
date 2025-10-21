import { ZodError } from 'zod';

/**
 * Mengubah array 'issues' dari ZodError menjadi objek yang lebih mudah dibaca.
 * @param zodError Error yang dilempar oleh Zod.
 * @returns Objek yang dipetakan dengan key dari path error.
 */
export const formatZodErrors = (zodError: ZodError) => {
  const details: { [key: string]: { message: string } } = {};

  for (const issue of zodError.issues) {
    let key: string;

    if (issue.code === 'unrecognized_keys') {
      // Untuk error "unrecognized_keys", 'path'-nya kosong.
      // Kuncinya ada di 'issue.keys[0]'
      key = issue.keys[0];
    } else {
      // Untuk error lain, kita gunakan 'path'
      // path: ["username"] -> "username"
      // path: ["favoriteNumbers", 1] -> "favoriteNumbers.1"
      key = issue.path.join('.');
    }

    // Tambahkan ke objek 'details'
    details[key] = {
      message: issue.message,
      // Catatan: 'value' (nilai yang salah) tidak tersedia di objek 'issue' Zod.
    };
  }

  return details;
};
