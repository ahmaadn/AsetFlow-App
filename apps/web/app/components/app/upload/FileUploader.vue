<script setup lang="ts">
defineProps<{
  show: boolean;
}>();

const model = defineModel<File[] | null>();
</script>

<template>
  <section v-if="show">
    <h2 class="text-lg font-semibold text-base-content mb-2">
      Langkah 2: Tambahkan Asset
    </h2>
    <p class="text-sm text-base-content/60 mb-4">
      Unggah file dari komputer Anda atau impor dari URL.
    </p>

    <div class="px-6">
      <ui-file-select v-model="model" />
    </div>
  </section>
</template>
