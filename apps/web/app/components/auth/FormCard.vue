<script setup lang="ts">
interface Props {
  title: string;
  subtitle?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="w-full max-w-md">
    <!-- Mobile Logo -->
    <div class="lg:hidden flex flex-col items-center mb-8">
      <ui-logo class="size-16 mb-4" />
      <h1 class="text-2xl font-bold">AsetFlow</h1>
    </div>

    <!-- Form Card -->
    <div class="bg-base-100 rounded-lg shadow-xl p-8 border border-base-300">
      <div class="mb-6">
        <h2 class="text-xl md:text-2xl font-bold text-base-content mb-2">
          {{ props.title }}
        </h2>
        <p v-if="props.subtitle" class="text-base-content/60">
          {{ props.subtitle }}
        </p>
      </div>

      <slot />
    </div>
  </div>
</template>
