<script setup lang="ts">
const sidebarRef = ref();

const pageTitle = computed(() => {
  return sidebarRef.value?.activeMenuItem?.label || 'Dashboard';
});
</script>

<template>
  <app-sidebar id="dashboard-drawer" ref="sidebarRef">
    <app-navbar drawer-id="dashboard-drawer" :title="pageTitle" />
    <div class="p-6 md:p-8 pb-20">
      <slot />
    </div>
  </app-sidebar>
</template>
