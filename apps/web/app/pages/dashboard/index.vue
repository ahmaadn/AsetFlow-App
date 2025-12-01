<script setup lang="ts">
import type { DashboardStatistics } from '@asetflow/shared-types';
import { getDashboardStatisticsApi } from '~/lib/api/statistics';

definePageMeta({
  layout: 'dashboard',
});

const auth = useAuth();

// State
const statistics = ref<DashboardStatistics | null>(null);
const isLoading = ref(true);

// Get user name from auth
const userName = computed(() => {
  if (auth.user.value?.email) {
    return auth.user.value.email.split('@')[0];
  }
  return 'User';
});

// Fetch dashboard data in one call
const loadDashboardData = async () => {
  try {
    isLoading.value = true;
    const data = await getDashboardStatisticsApi();
    statistics.value = data;
  } catch (error) {
    console.error('Error loading dashboard statistics:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadDashboardData();
});
</script>

<template>
  <div class="p-4 w-full space-y-6">
    <!-- Welcome Banner -->
    <dashboard-welcome-banner :user-name="userName" />

    <!-- Statistics Cards -->
    <ui-stat-group class="w-full bg-base-200 shadow-md">
      <ui-stat-item
        icon="ri:book-shelf-line"
        title="Assets"
        :value="isLoading ? '...' : String(statistics?.totalAssets || 0)"
        desc="Total Assets"
        color="primary"
      />
      <ui-stat-item
        icon="ri:folders-line"
        title="Folders"
        :value="isLoading ? '...' : String(statistics?.totalFolders || 0)"
        desc="Total Folders"
        color="secondary"
      />
      <ui-stat-item
        icon="ri:user-3-line"
        title="Users"
        :value="isLoading ? '...' : String(statistics?.totalUsers || 0)"
        desc="Total Users"
        color="accent"
      />
      <ui-stat-item
        icon="ri:eye-line"
        title="Views"
        :value="isLoading ? '...' : String(statistics?.totalViews || 0)"
        desc="Total Views"
        color="success"
      />
      <ui-stat-item
        icon="ri:database-2-line"
        title="Storage"
        :value="isLoading ? '...' : statistics?.totalStorage || '0 Bytes'"
        desc="Storage Used"
        color="info"
      />
    </ui-stat-group>

    <!-- Charts and Activity Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Asset Type Distribution -->

      <dashboard-asset-type-chart
        :data="statistics?.assetTypeDistribution || []"
        :is-loading="isLoading"
      />

      <!-- Recent Upload Activity -->

      <dashboard-upload-activity
        :data="statistics?.recentUploadActivity || []"
        :is-loading="isLoading"
      />
    </div>

    <!-- Recent Files -->
    <dashboard-recent-files
      :files="statistics?.recentFiles || []"
      :is-loading="isLoading"
    />
  </div>
</template>
