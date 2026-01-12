<script setup lang="ts">
import type { RecentUploadActivityType } from '@asetflow/shared-types';
import {
  VisXYContainer,
  VisAxis,
  VisStackedBar,
  VisTooltip,
} from '@unovis/vue';

import { StackedBar } from '@unovis/ts';

interface Props {
  data?: RecentUploadActivityType[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  isLoading: false,
});

// Unovis bar chart configuration
const x = (d: RecentUploadActivityType, i: number) => i;
const y = (d: RecentUploadActivityType) => d.count;

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const xTickFormat = (i: number) => {
  if (!props.data[i]) return '';
  return getDayName(props.data[i].date);
};

const getFullDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const triggers = {
  [StackedBar.selectors.bar]: (d: RecentUploadActivityType) => {
    return `
      <div style="padding: 12px; border-radius: 8px;  min-width: 180px;">
        <div style="font-weight: 600; color: var(--color-base-content); font-size: 14px; margin-bottom: 8px;">
          ${getFullDate(d.date)}
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="color: var(--color-base-content); font-size: 13px;">
            <span style="font-weight: 600; font-size: 16px;">${d.count}</span>
            <span style="margin-left: 4px;">${d.count === 1 ? 'upload' : 'uploads'}</span>
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
      <h2 class="card-title text-lg flex items-center gap-2">
        <Icon name="ri:upload-cloud-2-line" class="w-5 h-5" />
        Recent Upload Activity (Last 7 Days)
      </h2>

      <div v-if="isLoading" class="flex justify-center py-8">
        <span class="loading loading-spinner loading-md text-primary" />
      </div>

      <div v-else-if="props.data.length === 0" class="py-8 text-center">
        <Icon
          name="ri:upload-line"
          class="w-12 h-12 mx-auto text-base-content/30 mb-2"
        />
        <p class="text-sm text-base-content/60">No recent uploads</p>
      </div>

      <div v-else class="pt-4">
        <client-only>
          <div class="h-56 mb-4 pointer-events-auto">
            <VisXYContainer :data="props.data" :height="200" class="bar-chart">
              <VisTooltip :triggers="triggers" />
              <VisStackedBar
                :x="x"
                :y="y"
                :color="'var(--color-primary)'"
                :rounded-corners="4"
              />
              <VisAxis type="x" :tick-format="xTickFormat" :grid-line="false" />
              <VisAxis type="y" :grid-line="true" :tick-line="false" />
            </VisXYContainer>
          </div>
        </client-only>

        <div class="stats stats-horizontal shadow w-full bg-base-200">
          <div class="stat py-3">
            <div class="stat-title text-xs">Total Uploads</div>
            <div class="stat-value text-2xl text-primary">
              {{ props.data.reduce((sum, d) => sum + d.count, 0) }}
            </div>
          </div>
          <div class="stat py-3">
            <div class="stat-title text-xs">Daily Average</div>
            <div class="stat-value text-2xl text-primary">
              {{
                Math.round(
                  props.data.reduce((sum, d) => sum + d.count, 0) /
                    props.data.length
                )
              }}
            </div>
          </div>
          <div class="stat py-3">
            <div class="stat-title text-xs">Peak Day</div>
            <div class="stat-value text-2xl text-primary">
              {{ Math.max(...props.data.map((d) => d.count)) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
