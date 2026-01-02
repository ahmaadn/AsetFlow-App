<script setup lang="ts">
import type { DashboardStatisticsResponse } from '@asetflow/shared-types';

definePageMeta({
  layout: 'dashboard',
});

const auth = useAuth();
const { statistics } = useRepository(useSecureFetchAPI);
const { data } = statistics.getDashboardStatistics();
const statisticsData = ref<DashboardStatisticsResponse | null>(
  data.value || null
);
const isLoading = ref(true);

// Get user name from auth with fallback
const userName = computed(() => auth.user.value?.email);

// Fetch dashboard data in one call
const loadDashboardData = async () => {
  isLoading.value = true;
  const { data, error } = await statistics.getDashboardStatistics();
  if (data.value) {
    statisticsData.value = data.value;
  }
  if (error.value) {
    console.error('Error loading dashboard statistics:', error);
  }
  isLoading.value = false;
};

// Wait for authentication to be ready before loading dashboard data
watchEffect(async () => {
  if (auth.isAuthenticated.value && auth.user.value) {
    await loadDashboardData();
  }
});

// Fallback for mounted hook
onMounted(async () => {
  // Only load if auth is ready
  if (auth.isAuthenticated.value) {
    await loadDashboardData();
  }
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
        :value="isLoading ? '...' : String(statisticsData?.totalAssets || 0)"
        desc="Total Assets"
        color="primary"
      />
      <ui-stat-item
        icon="ri:folders-line"
        title="Folders"
        :value="isLoading ? '...' : String(statisticsData?.totalFolders || 0)"
        desc="Total Folders"
        color="secondary"
      />
      <ui-stat-item
        icon="ri:user-3-line"
        title="Users"
        :value="isLoading ? '...' : String(statisticsData?.totalUsers || 0)"
        desc="Total Users"
        color="accent"
      />
      <ui-stat-item
        icon="ri:eye-line"
        title="Views"
        :value="isLoading ? '...' : String(statisticsData?.totalViews || 0)"
        desc="Total Views"
        color="success"
      />
      <ui-stat-item
        icon="ri:database-2-line"
        title="Storage"
        :value="isLoading ? '...' : statisticsData?.totalStorage || '0 Bytes'"
        desc="Storage Used"
        color="info"
      />
    </ui-stat-group>

    <!-- Charts and Activity Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Asset Type Distribution -->

      <dashboard-asset-type-chart
        :data="statisticsData?.assetTypeDistribution || []"
        :is-loading="isLoading"
      />

      <!-- Recent Upload Activity -->

      <dashboard-upload-activity
        :data="statisticsData?.recentUploadActivity || []"
        :is-loading="isLoading"
      />
    </div>

    <!-- Recent Files -->
    <dashboard-recent-files
      :files="statisticsData?.recentFiles || []"
      :is-loading="isLoading"
    />
  </div>
</template>
