<script setup lang="ts">
interface Props {
  userName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  userName: 'User',
});

const currentHour = new Date().getHours();
const greeting = computed(() => {
  if (currentHour < 12) return 'Good Morning';
  if (currentHour < 18) return 'Good Afternoon';
  return 'Good Evening';
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});
</script>

<template>
  <div
    class="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white shadow-lg"
  >
    <div
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div class="flex-1">
        <h1 class="text-2xl md:text-3xl font-bold mb-2">
          {{ greeting }}, {{ props.userName }}! 👋
        </h1>
        <p class="text-white/90 text-sm md:text-base mb-3">
          {{ currentDate }}
        </p>
        <p class="text-white/80 text-sm max-w-2xl">
          Manage your digital assets efficiently with AsetFlow. Upload,
          organize, and share your files with ease.
        </p>
        <div class="mt-6 inline-flex gap-x-3">
          <NuxtLink
            to="/media"
            class="btn btn-outline btn-sm md:btn-md gap-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
          >
            <Icon name="ri:compass-3-line" class="w-5 h-5" />
            <span class="hidden sm:inline">Explore Assets</span>
            <span class="sm:hidden">Explore</span>
          </NuxtLink>
          <NuxtLink
            to="/media/add"
            class="btn btn-neutral btn-sm md:btn-md gap-2 shadow-md hover:shadow-lg transition-shadow"
          >
            <Icon name="ri:upload-cloud-2-line" class="w-5 h-5" />
            <span class="hidden sm:inline">Upload Asset</span>
            <span class="sm:hidden">Upload</span>
          </NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden lg:block">
          <Icon name="ri:dashboard-3-line" class="w-16 h-16 opacity-20" />
        </div>
      </div>
    </div>
  </div>
</template>
