// Types
// -------------------------

export interface RecentFileType {
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

export interface AssetDistributionType {
  type: string;
  count: number;
  percentage: number;
}

export interface RecentUploadActivityType {
  date: string;
  count: number;
}

// Response Types
// -------------------------

export interface DashboardStatisticsResponse {
  totalAssets: number;
  totalFolders: number;
  totalUsers: number;
  totalStorage: string;
  storageBytes: number;
  totalViews: number;
  recentFiles: RecentFileType[];
  assetTypeDistribution: AssetDistributionType[];
  recentUploadActivity: RecentUploadActivityType[];
}
