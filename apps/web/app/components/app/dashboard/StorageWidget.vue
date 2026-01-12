<script setup lang="ts">
interface Props {
  storageUsed: string;
  storageTotal: string;
  storagePercentage: number;
  badge?: string;
  bgColor?: string;
  glowColor1?: string;
  glowColor2?: string;
}

const props = withDefaults(defineProps<Props>(), {
  badge: undefined,
  bgColor: 'bg-[#0F172A]',
  glowColor1: 'bg-blue-500/20',
  glowColor2: 'bg-purple-500/20',
});

// Dynamic progress bar color based on storage percentage
const progressColorClass = computed(() => {
  if (props.storagePercentage >= 90) {
    return 'progress-error'; // Red - critical
  } else if (props.storagePercentage >= 75) {
    return 'progress-warning'; // Orange/Yellow - warning
  } else if (props.storagePercentage >= 50) {
    return 'progress-info'; // Blue - moderate
  }
  return 'progress-success'; // Green - good
});
</script>

<template>
  <div
    class="card text-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative rounded-md"
    :class="bgColor"
  >
    <!-- Background glow effect -->
    <div
      class="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl"
      :class="glowColor1"
    ></div>
    <div
      class="absolute top-1/2 -left-10 w-24 h-24 rounded-full blur-2xl"
      :class="glowColor2"
    ></div>

    <div class="card-body p-6 relative z-10">
      <div class="flex justify-between items-start mb-2">
        <div
          class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"
        >
          <Icon name="ri:database-2-fill" class="w-5 h-5 text-white" />
        </div>
        <span
          v-if="badge"
          class="badge badge-sm bg-white/20 border-0 text-white text-xs font-bold"
        >
          {{ badge }}
        </span>
      </div>

      <div class="mt-auto space-y-2">
        <div class="flex justify-between items-end">
          <span class="text-sm font-medium text-white/80">Storage</span>
          <span class="text-sm font-bold">{{ storagePercentage }}%</span>
        </div>
        <progress
          class="progress w-full h-2 bg-white/10"
          :class="progressColorClass"
          :value="storagePercentage"
          max="100"
        ></progress>
        <p class="text-xs text-white/60 font-medium">
          {{ storageUsed }} of {{ storageTotal }} used
        </p>
      </div>
    </div>
  </div>
</template>
