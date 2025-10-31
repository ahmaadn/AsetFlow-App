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

interface MenuItem {
  label: string;
  icon: string;
  to: string;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export type { Asset, AssetType, MenuItem, MenuSection };
