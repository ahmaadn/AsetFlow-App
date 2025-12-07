import { type FolderModel, prisma } from '@asetflow/database';

/**
 * Mencari folder berdasarkan slug
 */
export const findBySlug = async (slug: string): Promise<FolderModel | null> => {
  return await prisma.folder.findUnique({
    where: { slug },
  });
};
