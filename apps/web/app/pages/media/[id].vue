<script setup lang="ts">
definePageMeta({
  title: 'Media Item',
  validate(route) {
    const id = route.params.id as string;
    const paths = ['index', 'document', 'image', 'video', 'audio'];

    if (!paths.includes(id)) {
      return false;
    }

    return true;
  },
});

const route = useRoute();
const param = ref(route.params.id as string);

const mediaType = computed(() => {
  const types = {
    index: 'All Media',
    document: 'Documents',
    image: 'Images',
    video: 'Videos',
    audio: 'Audios',
  } as const;

  return types[param.value as keyof typeof types] || 'Media';
});
</script>

<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center space-y-6">
      <!-- Icon -->
      <div
        class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10"
      >
        <Icon name="ri:tools-line" class="w-12 h-12 text-primary" />
      </div>

      <!-- Text -->
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ mediaType }} - Coming Soon
        </h1>
        <p class="text-gray-800">This page is currently under development</p>
      </div>

      <!-- Button -->
      <NuxtLink to="/media" class="btn btn-primary">
        <Icon name="ri:arrow-left-line" class="w-5 h-5" />
        Back to Media
      </NuxtLink>
    </div>
  </div>
</template>
