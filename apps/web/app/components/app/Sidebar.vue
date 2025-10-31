<script setup lang="ts">
import type { MenuItem, MenuSection } from '~/types';

interface Props {
  id?: string;
  menuSections: MenuSection[];
}

const props = withDefaults(defineProps<Props>(), {
  id: 'app-sidebar',
});

const emit = defineEmits<{
  (e: 'item-click', item: MenuItem): void;
  (e: 'logout'): void;
}>();

const route = useRoute();

const activeMenuItem = computed((): MenuItem | null => {
  for (const section of props.menuSections) {
    const activeItem = section.items.find((item) => isActiveLink(item.to));
    if (activeItem) return activeItem;
  }
  return null;
});

defineExpose({
  activeMenuItem,
});

const isActiveLink = (itemTo: string): boolean => {
  if (!itemTo || itemTo === '') return false;

  // Exact match untuk home/dashboard
  if (itemTo === '/' || itemTo === '/dashboard') {
    return route.path === itemTo;
  }

  // Starts with untuk nested routes
  return route.path.startsWith(itemTo);
};

const handleItemClick = (item: MenuItem) => {
  // Handle logout khusus
  if (item.to === '/logout') {
    emit('logout');
    return;
  }

  emit('item-click', item);
};

const getLinkClass = (item: MenuItem) => {
  return {
    'text-primary bg-base-200 hover:bg-base-300 border-l-4 border-primary':
      isActiveLink(item.to),
    'opacity-50 cursor-not-allowed': item.disabled,
  };
};
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input :id="props.id" type="checkbox" class="drawer-toggle" />

    <main class="drawer-content">
      <slot />
    </main>

    <aside class="drawer-side z-40">
      <label
        :for="props.id"
        aria-label="close sidebar"
        class="drawer-overlay"
      />

      <div
        class="min-h-full w-72 bg-base-100 shadow-lg shadow-base-300 border-r border-base-300 text-base-content flex flex-col"
      >
        <!-- Logo/Brand -->
        <div
          class="p-4 flex items-center gap-x-2 font-brand border-b border-base-300"
        >
          <UiLogo class="h-11 w-11" />
          <span class="font-bold text-2xl md:text-3xl">AsetFlow</span>
        </div>

        <!-- Menu Sections -->
        <nav class="flex-1 overflow-y-auto">
          <template
            v-for="(section, sectionIndex) in props.menuSections"
            :key="section.title"
          >
            <ul class="menu px-4 py-2 w-full">
              <li>
                <h2 class="menu-title">{{ section.title }}</h2>
              </li>

              <li
                v-for="(item, itemIndex) in section.items"
                :key="`${sectionIndex}-${itemIndex}`"
              >
                <!-- External Link -->
                <a
                  v-if="item.external"
                  :href="item.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="getLinkClass(item)"
                  @click="handleItemClick(item)"
                >
                  <Icon :name="item.icon" class="size-5" />
                  <span class="flex-1">{{ item.label }}</span>
                  <Icon
                    v-if="item.external"
                    name="ri:external-link-line"
                    class="size-4 opacity-50"
                  />
                  <span v-if="item.badge" class="badge badge-sm badge-primary">
                    {{ item.badge }}
                  </span>
                </a>

                <!-- Internal Link -->
                <NuxtLink
                  v-else
                  :to="item.to"
                  :class="getLinkClass(item)"
                  :aria-current="isActiveLink(item.to) ? 'page' : undefined"
                  :tabindex="item.disabled ? -1 : 0"
                  @click="handleItemClick(item)"
                >
                  <Icon :name="item.icon" class="size-5" />
                  <span class="flex-1">{{ item.label }}</span>
                  <span v-if="item.badge" class="badge badge-sm badge-primary">
                    {{ item.badge }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </template>
        </nav>

        <!-- Footer (Optional Slot) -->
        <div v-if="$slots.footer" class="p-4 border-t border-base-300">
          <slot name="footer" />
        </div>
      </div>
    </aside>
  </div>
</template>
