<script setup lang="ts">
interface Props {
  isCollapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
  isCollapsed: false,
});
</script>

<template>
  <div
    class="p-4 flex items-center gap-x-2 font-brand border-b border-base-300 overflow-hidden whitespace-nowrap"
    :class="{ 'justify-center': isCollapsed }"
  >
    <div
      class="flex items-center justify-center size-10 bg-primary/20 rounded-md shrink-0"
    >
      <UiLogo class="h-8 w-8" />
    </div>
    <span
      class="font-bold text-2xl transition-opacity duration-300"
      :class="{
        'opacity-100': !isCollapsed,
        'lg:hidden lg:opacity-0 lg:w-0': isCollapsed,
      }"
    >
      <slot>AsetFlow</slot>
    </span>
  </div>
</template>
