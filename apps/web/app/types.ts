type AssetType = 'image' | 'video' | 'audio' | 'document';

type Asset = {
  name: string;
  slug: string;
  type: AssetType;
  size: string;
  assetUrl?: string;
  thumbnail?: string;
  publicUrl: string;
  claudinaryUrl?: string;
};

export type { Asset, AssetType };
