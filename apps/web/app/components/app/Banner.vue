<script setup lang="ts">
interface Props {
  title: string;
  subtitle: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
  >
    <div>
      <h1 class="text-3xl font-bold text-base-content">
        {{ props.title }}
      </h1>
      <p class="text-base-content/60 mt-1">
        {{ props.subtitle }}
      </p>
    </div>
    <slot />
  </div>
</template>
