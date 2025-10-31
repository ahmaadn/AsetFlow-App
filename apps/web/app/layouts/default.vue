<script setup lang="ts">
const { menuSections } = useMenu();
const sidebarRef = ref();

const pageTitle = computed(() => {
  return sidebarRef.value?.activeMenuItem?.label || 'Dashboard';
});
</script>

<template>
  <app-sidebar
    id="dashboard-drawer"
    ref="sidebarRef"
    :menu-sections="menuSections"
  >
    <app-navbar drawer-id="dashboard-drawer" :title="pageTitle" />
    <div>
      <slot />
    </div>
  </app-sidebar>
</template>
