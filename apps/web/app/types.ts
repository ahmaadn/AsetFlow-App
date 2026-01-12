import type { GeneralAssetType } from '@asetflow/shared';

type AssetType = 'image' | 'video' | 'audio' | 'document' | 'all';

interface MenuItem {
  label: string;
  icon: string;
  to?: string;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;

  action?: () => void;
}

interface MenuSection {
  title?: string;
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

export const ViewMode = {
  GRID: 'grid',
  LIST: 'list',
} as const;

export type ViewMode = (typeof ViewMode)[keyof typeof ViewMode];

export type { AssetType, MenuItem, MenuSection, StaggingFile };
