<script setup lang="ts">
const sidebarRef = ref();
const pageTitle = computed(() => {
  return sidebarRef.value?.activeMenuItem?.label || 'Dashboard';
});
</script>

<template>
  <app-sidebar id="dashboard-drawer" ref="sidebarRef">
    <app-navbar drawer-id="dashboard-drawer" :title="pageTitle" />
    <slot />
  </app-sidebar>
</template>
