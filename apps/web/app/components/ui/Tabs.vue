<script setup lang="ts">
const props = defineProps<{
  tabs: string[];
  modelValue?: number;
  classTabs?: string;
}>();

const emit = defineEmits<(e: 'update:modelValue', v: number) => void>();

const selected = ref<number>(props.modelValue ?? 0);

function onSelect(i: number) {
  selected.value = i;
  emit('update:modelValue', i);
}
</script>

<template>
  <div>
    <div role="tablist" class="tabs tabs-border" :class="classTabs">
      <button
        v-for="(t, i) in tabs"
        :key="i"
        role="tab"
        type="button"
        class="tab"
        :class="{ 'tab-active': selected === i }"
        @click="onSelect(i)"
      >
        {{ t }}
      </button>
    </div>

    <div>
      <slot :selected="selected" :select="onSelect" />
    </div>
  </div>
</template>

<style scoped>
.tab {
  user-select: none;
}
</style>
