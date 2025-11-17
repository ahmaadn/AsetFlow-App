export interface DashboardStatistics {
  totalAssets: number;
  totalFolders: number;
  totalUsers: number;
  totalStorage: string;
  storageBytes: number;
  totalViews: number;
  recentFiles: RecentFile[];
  assetTypeDistribution: AssetTypeDistribution[];
  recentUploadActivity: RecentUploadActivity[];
}

export interface RecentFile {
  id: string;
  name: string;
  slug: string;
  size: number;
  mimeType: string;
  url: string;
  format: string;
  viewCount: number;
  createdAt: Date;
  folder: {
    name: string;
    slug: string;
  };
}

export interface AssetTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface RecentUploadActivity {
  date: string;
  count: number;
}
