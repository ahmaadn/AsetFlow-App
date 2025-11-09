type AssetType = 'image' | 'video' | 'audio' | 'document' | 'all';

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

export type { AssetType, MenuItem, MenuSection };
