<script setup lang="ts">
const { menuSections } = useMenu();
const sidebarRef = ref();
const auth = useAuth();

const pageTitle = computed(() => {
  return sidebarRef.value?.activeMenuItem?.label || 'Dashboard';
});

const logout = async () => {
  await auth.logout();
  navigateTo('/login');
};
</script>

<template>
  <app-sidebar
    id="dashboard-drawer"
    ref="sidebarRef"
    :menu-sections="menuSections"
    @logout="logout"
  >
    <app-navbar drawer-id="dashboard-drawer" :title="pageTitle" />
    <slot />
  </app-sidebar>
</template>
