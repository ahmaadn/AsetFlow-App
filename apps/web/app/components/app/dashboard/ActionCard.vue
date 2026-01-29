<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
  to?: string;
  iconBgColor?: string;
  iconBgHoverColor?: string;
  iconColor?: string;
}

withDefaults(defineProps<Props>(), {
  to: undefined,
  iconBgColor: 'bg-blue-50',
  iconBgHoverColor: 'group-hover:bg-blue-100',
  iconColor: 'text-blue-500',
});

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-200 group text-left rounded-md"
  >
    <div class="card-body p-6">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors"
        :class="[iconBgColor, iconBgHoverColor]"
      >
        <Icon :name="icon" class="w-5 h-5" :class="iconColor" />
      </div>
      <h3 class="card-title text-base font-bold">{{ title }}</h3>
      <p class="text-xs text-base-content/60">{{ description }}</p>
    </div>
  </NuxtLink>
  <button
    v-else
    class="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 border border-base-200 group text-left rounded-md"
    @click="emit('click')"
  >
    <div class="card-body p-6">
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors"
        :class="[iconBgColor, iconBgHoverColor]"
      >
        <Icon :name="icon" class="w-5 h-5" :class="iconColor" />
      </div>
      <h3 class="card-title text-base font-bold">{{ title }}</h3>
      <p class="text-xs text-base-content/60">{{ description }}</p>
    </div>
  </button>
</template>
