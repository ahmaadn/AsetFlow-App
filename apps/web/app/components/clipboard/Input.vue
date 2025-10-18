<script setup lang="ts">
const props = defineProps<{
  title: string;
  value: string;
  id?: string;
}>();

const copied = ref(false);
async function copy() {
  try {
    await navigator.clipboard.writeText(props.value || '');
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch {
    // ignore
  }
}
</script>

<template>
  <div>
    <label
      :for="props.id"
      class="text-xs font-semibold uppercase text-neutral tracking-wider"
    >
      {{ props.title }}
    </label>
    <div class="mt-2 relative">
      <div class="join w-full">
        <input
          :id="props.id"
          type="text"
          class="input w-full join-item"
          readonly
          :value="props.value"
        />
        <button
          class="btn join-item transition-none btn-soft btn-primary"
          :aria-label="'Copy ' + props.value"
          @click.prevent="copy"
        >
          <Icon name="ri:clipboard-line" class="size-5" />
        </button>
      </div>
      <div v-if="copied" class="text-xs text-success mt-1">Copied</div>
    </div>
  </div>
</template>
