<script setup lang="ts">
interface Props {
  loading?: boolean;
  loadingText?: string;
  buttonText: string;
  buttonIcon?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingText: 'Loading...',
  variant: 'primary',
  buttonIcon: undefined,
});
</script>

<template>
  <button
    type="submit"
    class="btn w-full"
    :class="{
      'btn-primary': props.variant === 'primary',
      'btn-secondary': props.variant === 'secondary',
      'btn-ghost': props.variant === 'ghost',
    }"
    :disabled="props.loading"
  >
    <span v-if="props.loading" class="loading loading-spinner loading-sm" />
    <Icon
      v-else-if="props.buttonIcon"
      :name="props.buttonIcon"
      class="size-5"
    />
    {{ props.loading ? props.loadingText : props.buttonText }}
  </button>
</template>
