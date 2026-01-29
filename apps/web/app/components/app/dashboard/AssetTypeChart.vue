<script setup lang="ts">
import type { AssetDistributionType } from '@asetflow/shared-types';
import { VisSingleContainer, VisDonut, VisTooltip } from '@unovis/vue';
import { Donut } from '@unovis/ts';

interface Props {
  data?: AssetDistributionType[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  isLoading: false,
});

const createPrimaryGradient = (steps = 4) => {
  const mixPoints = [100, 75, 60, 40, 20, 0];
  return mixPoints
    .slice(0, steps)
    .map(
      (point) =>
        `color-mix(in srgb, var(--color-primary) ${point}%,   var(--color-base-content) ${
          100 - point
        }%)`
    );
};

const colors = createPrimaryGradient(5);

const chartData = computed(() => {
  return props.data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
  }));
});

const total = computed(() => {
  return props.data.reduce((sum, item) => sum + item.count, 0);
});

// Unovis donut configuration
const value = (d: AssetDistributionType) => d.count;
const donutColors = computed(() => chartData.value.map((d) => d.color));

const triggers = {
  [Donut.selectors.segment]: (d: { data: AssetDistributionType }) => {
    const item = d.data;
    const itemData = chartData.value.find((cd) => cd.type === item.type);
    return `
      <div style="padding: 12px;  border-radius: 8px;  min-width: 150px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <div style="width: 12px; height: 12px; background: ${itemData?.color || '#570df8'}; border-radius: 3px;"></div>
          <span style="font-weight: 600; text-transform: capitalize; color: var(--color-base-content); font-size: 14px;">
            ${item.type}
          </span>
        </div>
        <div style="color: var(--color-base-content); font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Count:</span>
            <span style="font-weight: 600;">${item.count}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Percentage:</span>
            <span style="font-weight: 600; color: var(--color-primary);">${item.percentage}%</span>
          </div>
        </div>
      </div>
    `;
  },
};
</script>

<template>
  <div class="card bg-base-100 shadow-md rounded-md">
    <div class="card-body">
      <h2 class="card-title text-lg flex items-center gap-2 flex-none">
        <Icon name="ri:pie-chart-2-line" class="w-5 h-5" />
        Asset Type Distribution
      </h2>
      <div v-if="isLoading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-md text-primary" />
      </div>
      <div
        v-else-if="props.data.length === 0"
        class="py-8 text-center flex-1 flex justify-center items-center w-full"
      >
        <div class="flex flex-col items-center gap-2 w-full">
          <Icon
            name="ri:pie-chart-line"
            class="w-12 h-12 mx-auto text-base-content/30 mb-2"
          />
          <p class="text-sm text-base-content/60 h-fit">No data available</p>
        </div>
      </div>
      <div
        v-else
        class="flex flex-col lg:flex-row items-center gap-6 py-4 flex-warp"
      >
        <!-- Donut Chart -->
        <div class="shrink-0 w-48 h-48 flex-1">
          <ClientOnly>
            <VisSingleContainer
              :data="chartData"
              :height="200"
              class="donut-chart"
            >
              <VisTooltip :triggers="triggers" :allow-hover="true" />
              <VisDonut
                :value="value"
                :color="donutColors"
                :central-label="String(total)"
                :central-sub-label="'Total Assets'"
              >
              </VisDonut>
            </VisSingleContainer>
          </ClientOnly>
        </div>
        <!-- Legend -->
        <div class="flex-1 w-full">
          <div class="space-y-2">
            <div
              v-for="item in chartData"
              :key="item.type"
              class="flex items-center justify-between p-2 rounded hover:bg-base-200 transition-colors"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-4 h-4 rounded"
                  :style="{ backgroundColor: item.color }"
                />
                <span class="text-sm font-medium capitalize">{{
                  item.type
                }}</span>
              </div>
              <div class="text-right">
                <span class="text-sm font-bold">{{ item.count }}</span>
                <span class="text-xs text-base-content/60 ml-1"
                  >({{ item.percentage }}%)</span
                >
              </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-base-300">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">Total Assets</span>
              <span class="text-lg font-bold text-primary">{{ total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
