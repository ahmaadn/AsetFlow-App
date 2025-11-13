import { GeneralAssetType, getMimeTypesForAssetType } from '@asetflow/shared';

// Helper untuk filter berdasarkan asset type
export const buildAssetTypeFilter = (assetType?: GeneralAssetType | 'all') => {
  if (!assetType || assetType === 'all' || assetType === 'unknown') {
    return {};
  }
  return {
    mimeType: {
      in: [...getMimeTypesForAssetType(assetType as GeneralAssetType)],
    },
  };
};
