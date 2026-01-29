<script setup lang="ts">
import type { MenuItem } from '~/types';

interface Props {
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: 'app-sidebar',
});

const { user } = useAuth();
const { isCollapsed, menuSections } = useAppState();

// Reference to SidebarMenu component for accessing activeMenuItem
const sidebarMenuRef = ref<InstanceType<
  typeof import('./sidebar/Menu.vue').default
> | null>(null);

const activeMenuItem = computed((): MenuItem | null => {
  return sidebarMenuRef.value?.activeMenuItem ?? null;
});

defineExpose({
  activeMenuItem,
});

// Storage data (can be replaced with real data from API)
// const storageData = reactive({
//   used: 7.2,
//   total: 10,
//   percentage: 72,
// });

// const handleUpgrade = () => {
//   // Handle upgrade action
//   console.log('Upgrade clicked');
// };
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input :id="props.id" type="checkbox" class="drawer-toggle" />

    <main class="drawer-content">
      <slot />
    </main>

    <aside class="drawer-side group" :class="{ 'is-collapsed': isCollapsed }">
      <label
        :for="props.id"
        aria-label="close sidebar"
        class="drawer-overlay"
      />

      <div
        class="min-h-full bg-base-100 shadow-lg shadow-base-300 border-r border-base-300 text-base-content flex flex-col transition-[width] duration-300 ease-in-out w-72 group-[.is-collapsed]:lg:w-20"
      >
        <!-- Logo/Brand -->
        <AppSidebarLogo :is-collapsed="isCollapsed" />

        <!-- Menu Sections -->
        <AppSidebarMenu
          ref="sidebarMenuRef"
          :sections="menuSections"
          :is-collapsed="isCollapsed"
        />

        <!-- Footer / User & Storage -->
        <div
          class="p-4 border-t border-base-300 overflow-hidden flex flex-col gap-4 bg-base-100 shrink-0"
          :class="{ 'items-center px-2 py-4': isCollapsed }"
        >
          <!-- Storage Widget -->
          <!-- <AppSidebarStorageWidget
            :storage="storageData"
            :is-collapsed="isCollapsed"
            @upgrade="handleUpgrade"
          /> -->

          <!-- User Profile -->
          <AppSidebarUserProfile :user="user" :is-collapsed="isCollapsed" />
        </div>
      </div>
    </aside>
  </div>
</template>
