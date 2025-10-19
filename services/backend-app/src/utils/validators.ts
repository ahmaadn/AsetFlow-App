/**
 * Memvalidasi apakah sebuah string adalah email yang valid dan tidak melebihi panjang maksimum.
 * @param email - String email yang akan divalidasi.
 * @returns {boolean} - True jika valid, false jika tidak.
 */
export function isValidEmail(email: string): boolean {
  // Pastikan input adalah string dan tidak kosong
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Cek panjang maksimum
  if (email.length > 100) {
    return false;
  }

  // Cek format menggunakan Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
