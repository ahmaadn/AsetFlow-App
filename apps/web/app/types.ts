import type { GeneralAssetType } from '@asetflow/shared';

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

interface StaggingFile {
  name: string;
  slug: string;
  file: File;
  extension?: string;
  assetType: GeneralAssetType;
  size: string;
  previewUrl?: string;
  errors: string[];
  isUploading: boolean;
}

export type { AssetType, MenuItem, MenuSection, ViewMode, StaggingFile };
