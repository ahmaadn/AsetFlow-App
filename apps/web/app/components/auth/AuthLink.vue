<script setup lang="ts">
interface Props {
  message: string;
  linkText: string;
  linkTo: string;
  linkIcon?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div>
    <div class="divider text-sm">{{ props.message }}</div>
    <div class="text-center">
      <NuxtLink :to="props.linkTo" class="btn btn-ghost w-full">
        <Icon v-if="props.linkIcon" :name="props.linkIcon" class="size-5" />
        {{ props.linkText }}
      </NuxtLink>
    </div>
  </div>
</template>
