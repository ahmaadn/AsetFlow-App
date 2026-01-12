<script setup lang="ts">
import type { DashboardStatisticsResponse } from '@asetflow/shared-types';

definePageMeta({
  layout: 'dashboard',
});

const { user } = useAuth();
const userName = computed(() => user.value?.name || 'User');
const storage = {
  storageUsed: '80GB',
  storageTotal: '100GB',
  storagePercentage: 80,
};

const { data: statisticsData, pending: isLoading } =
  await useFetchAPI<DashboardStatisticsResponse>('/v1/statistics/dashboard', {
    method: 'GET',
  });

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});
</script>

<template>
  <div class="w-full space-y-8">
    <div class="flex flex-col gap-8">
      <!-- Welcome Banner -->
      <AppBanner
        :title="`Welcome back, ${userName}`"
        :subtitle="`Here is what's happening with your digital assets today.`"
      >
        <div
          class="hidden md:flex items-center gap-2 bg-base-100 px-4 py-2 rounded-full border border-base-200 text-sm font-medium text-base-content/70 shadow-sm"
        >
          <Icon name="ri:calendar-line" class="w-4 h-4" />
          {{ formattedDate }}
        </div>
      </AppBanner>

      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8"
      >
        <!-- Upload Asset -->
        <AppDashboardActionCard
          to="/media/add"
          icon="ri:upload-cloud-2-fill"
          title="Upload Asset"
          description="Drag & drop or browse"
          icon-bg-color="bg-primary/10"
          icon-bg-hover-color="group-hover:bg-primary/20"
          icon-color="text-primary"
        />

        <!-- New Collection -->
        <AppDashboardActionCard
          icon="ri:folder-add-fill"
          title="New Collection"
          description="Organize your projects"
          icon-bg-color="bg-primary/10"
          icon-bg-hover-color="group-hover:bg-primary/20"
          icon-color="text-primary"
        />

        <!-- Share Files -->
        <AppDashboardActionCard
          icon="ri:share-forward-fill"
          title="Share Files"
          description="Create public links"
          icon-bg-color="bg-primary/10"
          icon-bg-hover-color="group-hover:bg-primary/20"
          icon-color="text-primary"
        />

        <!-- Storage Widget -->
        <AppDashboardStorageWidget
          :storage-used="storage.storageUsed"
          :storage-total="storage.storageTotal"
          :storage-percentage="storage.storagePercentage"
          badge="PRO"
        />
      </div>

      <!-- Statistics Cards -->
      <div
        class="stats stats-horizontal w-full bg-base-100 shadow-md rounded-md"
      >
        <UiStatItem
          icon="ri:book-shelf-line"
          title="Assets"
          :value="isLoading ? '...' : String(statisticsData?.totalAssets || 0)"
          desc="Total Assets"
          color="primary"
        />
        <UiStatItem
          icon="ri:folders-line"
          title="Folders"
          :value="isLoading ? '...' : String(statisticsData?.totalFolders || 0)"
          desc="Total Folders"
          color="primary"
        />
      </div>
      <!-- <UiStatItem
      icon="ri:user-3-line"
      title="Users"
      :value="isLoading ? '...' : String(statisticsData?.totalUsers || 0)"
      desc="Total Users"
      color="accent"
    /> -->
      <!-- <UiStatItem
        icon="ri:eye-line"
        title="Views"
        :value="isLoading ? '...' : String(statisticsData?.totalViews || 0)"
        desc="Total Views"
        color="success"
      /> -->
      <!-- <UiStatItem
      icon="ri:database-2-line"
      title="Storage"
      :value="isLoading ? '...' : statisticsData?.totalStorage || '0 Bytes'"
      desc="Storage Used"
      color="info"
    /> -->

      <!-- Charts and Activity Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Asset Type Distribution -->
        <AppDashboardAssetTypeChart
          :data="statisticsData?.assetTypeDistribution || []"
          :is-loading="isLoading"
        />

        <!-- Recent Upload Activity -->
        <AppDashboardUploadActivity
          :data="statisticsData?.recentUploadActivity || []"
          :is-loading="isLoading"
        />
      </div>

      <!-- Recent Files -->
      <AppDashboardRecentFiles
        :files="statisticsData?.recentFiles || []"
        :is-loading="isLoading"
      />
    </div>
  </div>
</template>
