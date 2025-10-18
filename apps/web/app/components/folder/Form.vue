<script setup lang="ts">
const props = defineProps<{
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}>();

const modelValue = defineModel<string>({
  default: '',
  required: false,
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function onCancel() {
  emit('close');
}

const sizes = {
  xs: { value: 'input-xs', icon: 'size-4', btn: 'btn-xs' },
  sm: { value: 'input-sm', icon: 'size-5', btn: 'btn-sm' },
  md: { value: 'input-md', icon: 'size-6', btn: 'btn-md' },
  lg: { value: 'input-lg', icon: 'size-7', btn: 'btn-lg' },
  xl: { value: 'input-xl', icon: 'size-8', btn: 'btn-xl' },
};
</script>

<template>
  <form class="flex items-center gap-2 flex-nowrap">
    <input
      v-model="modelValue"
      type="text"
      placeholder="Type here"
      class="input w-full input-primary"
      required
      :class="sizes[props.size ?? 'md'].value"
    />
    <button
      class="btn btn-square btn-ghost btn-success"
      :class="sizes[props.size ?? 'md'].btn"
    >
      <Icon
        name="ri:check-double-fill"
        :class="sizes[props.size ?? 'md'].icon"
      />
    </button>
    <button
      class="btn btn-ghost btn-error btn-square"
      :class="sizes[props.size ?? 'md'].btn"
      @click="onCancel"
    >
      <Icon name="ri:close-fill" :class="sizes[props.size ?? 'md'].icon" />
    </button>
  </form>
</template>
