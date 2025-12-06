import { prisma, UserModel } from '@asetflow/database';

/**
 * Mengambil semua pengguna.
 * @returns Daftar pengguna.
 */
export const findAll = () => {
  return prisma.user.findMany();
};

/**
 * Mencari pengguna berdasarkan email.
 * @param email Alamat email pengguna.
 * @returns Pengguna yang ditemukan atau null jika tidak ada.
 */
export const findByEmail = async (email: string): Promise<UserModel | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};
