import { getAssetTypeFromMime } from '@asetflow/shared';
import {
  AssetTypeDistribution,
  RecentUploadActivity,
} from '@asetflow/shared-types';

/**
 * Calculate asset type distribution from grouped mime types
 */
export function calculateAssetTypeDistribution(
  groupedAssets: { mimeType: string; _count: { mimeType: number } }[]
): AssetTypeDistribution[] {
  const typeMap = new Map<string, number>();

  groupedAssets.forEach((asset) => {
    const type = getAssetTypeFromMime(asset.mimeType);
    const currentCount = typeMap.get(type) || 0;
    typeMap.set(type, currentCount + asset._count.mimeType);
  });

  const total = groupedAssets.reduce(
    (sum, asset) => sum + asset._count.mimeType,
    0
  );
  const distribution: AssetTypeDistribution[] = [];

  // Calculate raw percentages and keep track of remainders
  const temp: {
    type: string;
    count: number;
    raw: number;
    floored: number;
    remainder: number;
    percentage: number;
  }[] = [];
  let flooredSum = 0;
  typeMap.forEach((count, type) => {
    const raw = total > 0 ? (count / total) * 100 : 0;
    const floored = Math.floor(raw);
    flooredSum += floored;
    temp.push({
      type,
      count,
      raw,
      floored,
      remainder: raw - floored,
      percentage: 0,
    });
  });

  // Distribute the remaining percentage points to the largest remainders
  let remainderPoints = 100 - flooredSum;
  temp.sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < temp.length; i++) {
    const item = temp[i];
    if (item) {
      item.percentage = item.floored + (remainderPoints > 0 ? 1 : 0);
      if (remainderPoints > 0) remainderPoints--;
    }
  }

  // Restore original order (by count descending)
  temp.sort((a, b) => b.count - a.count);
  temp.forEach(({ type, count, percentage }) => {
    distribution.push({
      type,
      count,
      percentage,
    });
  });

  return distribution;
}

/**
 * Calculate recent upload activity
 */
export function calculateRecentUploadActivity(
  assets: { createdAt: Date }[],
  days: number
): RecentUploadActivity[] {
  const startDate = getStartDate(days);
  const dateMap = new Map<string, number>();

  // Initialize all days with 0
  for (let dayOffset = 0; dayOffset < days; dayOffset++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split('T')[0] as string;
    dateMap.set(dateStr, 0);
  }

  // Count uploads per day
  assets.forEach((asset) => {
    const dateStr = asset.createdAt.toISOString().split('T')[0] as string;
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
  });

  const activity: RecentUploadActivity[] = [];
  dateMap.forEach((count, date) => {
    activity.push({ date, count });
  });

  return activity.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get start date for activity calculation
 */
export function getStartDate(days: number): Date {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  return startDate;
}
