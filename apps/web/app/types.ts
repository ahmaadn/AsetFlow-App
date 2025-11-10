type AssetType = 'image' | 'video' | 'audio' | 'document' | 'all';
type ViewMode = 'grid' | 'list';

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

export type { AssetType, MenuItem, MenuSection, ViewMode };
