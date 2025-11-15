<script setup lang="ts">
interface Props {
  drawerId?: string;
  title?: string;
  showAddButton?: boolean;
  addButtonLabel?: string;
  addButtonTo?: string;
}

const props = withDefaults(defineProps<Props>(), {
  drawerId: 'my-drawer-2',
  title: 'Dashboard',
  showAddButton: true,
  addButtonLabel: 'Add Assets',
  addButtonTo: '/media/add',
});

const emit = defineEmits<{
  (e: 'add-click'): void;
}>();

const handleAddClick = () => {
  emit('add-click');
};
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm z-10">
    <div class="flex-none lg:hidden">
      <label
        :for="props.drawerId"
        class="btn btn-square btn-ghost drawer-button lg:hidden"
      >
        <Icon name="ri:layout-left-2-line" class="h-5 w-5" />
      </label>
    </div>
    <div class="flex-1 h-full">
      <div class="flex items-center h-10">
        <p class="px-4 font-bold md:text-xl text-lg">{{ props.title }}</p>
      </div>
    </div>
    <div class="flex-none">
      <div v-if="showAddButton" class="px-4 flex items-center gap-x-2">
        <NuxtLink
          class="btn btn-primary"
          :to="props.addButtonTo"
          @click="handleAddClick"
        >
          <Icon name="ri:add-line" class="h-5 w-5" />
          {{ props.addButtonLabel }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
