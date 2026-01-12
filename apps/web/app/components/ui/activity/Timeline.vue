<script setup lang="ts">
export interface ActivityItem {
  id: string;
  action: string;
  user?: string;
  date: string;
}

interface Props {
  activities: ActivityItem[];
  loading?: boolean;
  initialCount?: number;
  skeletonCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  initialCount: 2,
  skeletonCount: 2,
});

const isExpanded = ref(false);

// Computed for displayed activities
const displayedActivities = computed(() => {
  if (isExpanded.value) {
    return props.activities;
  }
  return props.activities.slice(0, props.initialCount);
});

const hasMore = computed(() => props.activities.length > props.initialCount);
const remainingCount = computed(
  () => props.activities.length - props.initialCount
);

// Toggle expansion
const toggle = () => {
  isExpanded.value = !isExpanded.value;
};

// Expose toggle method for parent components
defineExpose({ toggle, isExpanded });
</script>

<template>
  <!-- Skeleton -->
  <div v-if="loading" class="space-y-6 pl-4">
    <div v-for="i in skeletonCount" :key="i" class="space-y-1">
      <div class="skeleton h-4 w-40"></div>
      <div class="skeleton h-3 w-20"></div>
    </div>
  </div>

  <!-- Activity List -->
  <div v-else>
    <div class="relative pl-4 border-l border-base-300 space-y-6">
      <TransitionGroup name="activity-list">
        <div
          v-for="(activity, index) in displayedActivities"
          :key="activity.id"
          class="relative"
        >
          <div
            class="absolute -left-5.25 top-0 size-2.5 rounded-full border-2 border-base-100"
            :class="index === 0 ? 'bg-primary' : 'bg-base-300'"
          ></div>
          <p class="text-sm text-base-content font-medium leading-none">
            <span v-if="activity.user" class="text-primary">{{
              activity.user
            }}</span>
            {{ activity.user ? ' ' : '' }}{{ activity.action }}
          </p>
          <p class="text-xs text-base-content/60 mt-1">
            {{ formatRelativeTime(activity.date) }}
          </p>
        </div>
      </TransitionGroup>
    </div>

    <!-- Show more/less button -->
    <button
      v-if="hasMore"
      class="btn btn-ghost btn-xs mt-4 text-primary hover:text-primary-focus"
      @click="toggle"
    >
      <Icon
        :name="isExpanded ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'"
        class="size-4"
      />
      {{ isExpanded ? 'Show less' : `Show ${remainingCount} more` }}
    </button>
  </div>
</template>

<style scoped>
/* Activity list transition */
.activity-list-enter-active,
.activity-list-leave-active {
  transition: all 0.3s ease;
}

.activity-list-enter-from,
.activity-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.activity-list-move {
  transition: transform 0.3s ease;
}
</style>
