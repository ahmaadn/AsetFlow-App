import { Prisma } from '../prisma/generated/client';

/**
 * Memeriksa apakah sebuah error adalah Prisma error 'record not found'.
 * Kode P2025.
 */
export const isPrismaNotFoundError = (
  e: Error
): e is Prisma.PrismaClientKnownRequestError => {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025'
  );
};

/**
 * Memeriksa apakah sebuah error adalah Prisma error 'unique constraint violation'.
 * Kode P2002. Berguna untuk kasus seperti "email sudah terdaftar".
 */
export const isPrismaConflictError = (
  e: Error
): e is Prisma.PrismaClientKnownRequestError => {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
  );
};

/**
 * Memeriksa apakah sebuah error adalah Prisma error 'foreign key constraint failed'.
 * Kode P2003. Terjadi saat mencoba menghubungkan ke record yang tidak ada.
 */
export const isPrismaForeignKeyConstraintError = (
  e: Error
): e is Prisma.PrismaClientKnownRequestError => {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003'
  );
};

/**
 * Memeriksa apakah sebuah error adalah Prisma error validasi.
 * Terjadi saat input tidak sesuai dengan skema (misal: tipe data salah)
 * bahkan sebelum query dieksekusi.
 */
export const isPrismaValidationError = (
  e: Error
): e is Prisma.PrismaClientValidationError => {
  return e instanceof Prisma.PrismaClientValidationError;
};
