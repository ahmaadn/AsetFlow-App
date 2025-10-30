import { AsetCreate } from '@asetflow/shared-types';

import * as AssetRepository from '../repositories/aset.repository';

/**
 * Membuat aset baru.
 * @param data Data aset yang akan dibuat.
 * @returns Aset yang telah dibuat.
 */
export const createAset = async (data: AsetCreate) => {
  return await AssetRepository.create(data);
};
