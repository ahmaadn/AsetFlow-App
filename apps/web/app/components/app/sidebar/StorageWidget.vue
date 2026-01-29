<script setup lang="ts">
interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
}

interface Props {
  storage?: StorageInfo;
  isCollapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
  storage: () => ({
    used: 0,
    total: 10,
    percentage: 0,
  }),
  isCollapsed: false,
});

const emit = defineEmits<{
  upgrade: [];
}>();
</script>

<template>
  <div
    class="bg-base-200 rounded-xl p-4 flex flex-col gap-2"
    :class="{ 'lg:hidden': isCollapsed }"
  >
    <div class="flex items-center justify-between text-xs font-bold">
      <span class="text-base-content/70">STORAGE</span>
      <span>{{ storage.percentage }}%</span>
    </div>
    <progress
      class="progress progress-primary w-full h-2"
      :value="storage.percentage"
      max="100"
    ></progress>
    <div class="text-xs text-base-content/60">
      {{ storage.used }} GB of {{ storage.total }} GB used
    </div>
    <button
      class="btn btn-xs btn-outline btn-primary w-full mt-1 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-content"
      @click="emit('upgrade')"
    >
      <slot name="action">Upgrade Plan</slot>
    </button>
  </div>
</template>
