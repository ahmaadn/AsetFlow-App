<script setup lang="ts">
import type { ComboBoxOption, ComboBoxValue } from './state';

const props = defineProps<{
  modelValue: ComboBoxValue;
  multiple: boolean;
  placeholder: string;
  query: string;
  isOpen: boolean;
  localId: string;
}>();

const emit = defineEmits<{
  'update:query': [value: string];
  open: [];
  clear: [];
  toggle: [];
  'remove-option': [option: ComboBoxOption];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

function focusInput() {
  setTimeout(() => inputRef.value?.focus(), 0);
}

function onOpen() {
  emit('open');
  focusInput();
}

function onInput() {
  if (!props.isOpen) emit('open');
}

const displayPlaceholder = computed(() => {
  if (props.multiple) return props.placeholder;
  if (props.modelValue && !Array.isArray(props.modelValue)) {
    return props.modelValue.label;
  }
  return props.placeholder;
});

const showClearButton = computed(() => {
  return (
    props.query ||
    (props.modelValue &&
      (Array.isArray(props.modelValue) ? props.modelValue.length > 0 : true))
  );
});

defineExpose({
  focusInput,
});
</script>

<template>
  <div
    class="input flex items-center justify-between w-full h-auto min-h-(--size)"
    role="combobox"
    :aria-expanded="isOpen"
    @click="onOpen"
  >
    <div
      class="inline-flex w-full gap-2 items-center flex-wrap"
      :class="{ 'py-2': multiple }"
    >
      <div v-if="multiple && Array.isArray(modelValue)" class="contents">
        <UiComboBadge
          v-for="(item, index) in modelValue"
          :key="index"
          :option="item"
          @remove="emit('remove-option', $event)"
        />
      </div>
      <div class="flex-1 min-w-25">
        <input
          :id="`combo-box-input-${localId}`"
          ref="inputRef"
          :value="query"
          :name="`combo-box-input-${localId}`"
          :placeholder="displayPlaceholder"
          :class="{
            '': multiple,
            'placeholder:text-neutral': !multiple,
          }"
          @input="
            emit('update:query', ($event.target as HTMLInputElement).value)
          "
          @focusin="onInput"
        />
      </div>
    </div>

    <div class="inline-flex gap-1 flex-nowrap">
      <button
        v-if="showClearButton"
        type="button"
        class="flex h-full items-center"
        @click.stop="emit('clear')"
      >
        <Icon name="ri:close-line" class="h-5 w-5" />
      </button>
      <button
        type="button"
        class="flex h-full items-center"
        @click.stop="emit('toggle')"
      >
        <Icon
          name="ri:arrow-drop-up-fill"
          class="h-5 w-5"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>
    </div>
  </div>
</template>
