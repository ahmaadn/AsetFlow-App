<script setup lang="ts">
interface Props {
  inputValue?: string;
  inputRequiredValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  inputValue: '',
});

const inputValue = ref(props.inputValue);

const canConfirm = computed(() => {
  return props.inputRequiredValue === inputValue.value;
});
</script>

<template>
  <fieldset class="fieldset mt-4" v-bind="$attrs">
    <legend class="fieldset-legend">
      Please type
      <span id="folder-slug" class="text-error">{{ inputRequiredValue }}</span>
      to complete action
    </legend>
    <input
      v-model="inputValue"
      type="text"
      class="input w-full input-sm,"
      placeholder="ketik di sini"
    />
  </fieldset>
  <slot :can-confirm="canConfirm"></slot>
</template>
