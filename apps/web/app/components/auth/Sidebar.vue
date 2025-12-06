<script setup lang="ts">
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Manage Your Digital Assets with Ease',
  subtitle:
    'Organize, store, and share your media files efficiently with our powerful asset management platform.',
  features: () => [
    {
      icon: 'ri:checkbox-circle-fill',
      title: 'Secure Storage',
      description: 'Your assets are protected with enterprise-grade security',
    },
    {
      icon: 'ri:checkbox-circle-fill',
      title: 'Easy Organization',
      description: 'Intuitive folder structure and tagging system',
    },
    {
      icon: 'ri:checkbox-circle-fill',
      title: 'Fast Access',
      description: 'Quick search and instant previews for all your files',
    },
  ],
});
</script>

<template>
  <div
    class="hidden lg:flex flex-col justify-between p-12 relative bg-primary text-primary-content overflow-hidden"
  >
    <!-- Decorative circles -->
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
    />
    <div
      class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
    />

    <div class="relative z-10">
      <div class="flex items-center gap-3 mb-8">
        <ui-logo class="size-12 text-white" />
        <span class="text-2xl font-bold">AsetFlow</span>
      </div>
      <h2 class="text-4xl font-bold mb-4">
        {{ props.title }}
      </h2>
      <p class="text-lg text-primary-content/80 max-w-md">
        {{ props.subtitle }}
      </p>
    </div>

    <div class="relative z-10 space-y-4">
      <div
        v-for="feature in props.features"
        :key="feature.title"
        class="flex items-start gap-3"
      >
        <Icon :name="feature.icon" class="size-6 mt-0.5" />
        <div>
          <h3 class="font-semibold mb-1">{{ feature.title }}</h3>
          <p class="text-sm text-primary-content/70">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
