<script setup lang="ts">
const sidebarRef = ref();

const pageTitle = computed(() => {
  return sidebarRef.value?.activeMenuItem?.label || 'Dashboard';
});
</script>

<template>
  <app-sidebar id="dashboard-drawer" ref="sidebarRef">
    <app-navbar drawer-id="dashboard-drawer" :title="pageTitle" />
    <div class="m-6 md:m-8 mb-20 min-h-[calc(100dvh-4.5rem)]">
      <slot />
    </div>
  </app-sidebar>
</template>
