<script setup lang="ts">
import type { MenuItem, MenuSection } from '~/types';

interface Props {
  sections: MenuSection[];
  isCollapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
});

const emit = defineEmits<{
  itemClick: [item: MenuItem];
}>();

const route = useRoute();

const normalizePath = (path: string) => {
  if (path === '/') return path;
  return path.endsWith('/') ? path.slice(0, -1) : path;
};

const isActiveLink = (itemTo?: string): boolean => {
  if (!itemTo) return false;

  const hasQuery = itemTo.includes('?');
  const currentFullPath = route.fullPath || route.path;

  if (hasQuery) {
    return currentFullPath.startsWith(itemTo);
  }

  const target = normalizePath(itemTo);
  const current = normalizePath(route.path);

  if (target === '/' || target === '/dashboard') {
    return current === target;
  }

  return current.startsWith(target);
};

const isItemActive = (item: MenuItem): boolean => {
  if (item.to && isActiveLink(item.to)) {
    return true;
  }
  return Boolean(item.children?.some((child) => isItemActive(child)));
};

const findActiveItem = (items: MenuItem[]): MenuItem | null => {
  for (const item of items) {
    if (item.to && isActiveLink(item.to)) {
      return item;
    }
    if (item.children) {
      const childActive = findActiveItem(item.children);
      if (childActive) {
        return childActive;
      }
    }
  }
  return null;
};

const activeMenuItem = computed((): MenuItem | null => {
  for (const section of props.sections) {
    const found = findActiveItem(section.items);
    if (found) return found;
  }
  return null;
});

defineExpose({
  activeMenuItem,
  isItemActive,
  isActiveLink,
});

const handleItemClick = (item: MenuItem) => {
  emit('itemClick', item);
};
</script>

<template>
  <nav
    class="flex-1 overflow-y-auto overflow-x-hidden"
    :class="{
      'lg:overflow-visible lg:flex lg:flex-col lg:items-center': isCollapsed,
    }"
  >
    <template v-for="(section, sectionIndex) in sections" :key="section.title">
      <ul
        class="menu px-4 pt-2 pb-0 w-full gap-y-1 last:pb-2"
        :class="{
          'lg:w-fit lg:px-2': isCollapsed,
        }"
      >
        <li v-if="section.title">
          <h2 class="menu-title" :class="{ 'lg:hidden': isCollapsed }">
            {{ section.title }}
          </h2>
          <div v-if="isCollapsed" class="hidden lg:px-0 lg:block">
            <div class="divider my-0"></div>
          </div>
        </li>

        <AppSidebarMenuItem
          v-for="(item, itemIndex) in section.items"
          :key="`${sectionIndex}-${itemIndex}`"
          :item="item"
          :is-collapsed="isCollapsed"
          :is-active="isItemActive(item)"
          :has-children="item.children && item.children.length > 0"
          @click="handleItemClick"
        >
          <ul
            v-if="item.children && item.children.length > 0"
            class="ml-4 mt-1 space-y-1"
            :class="{ 'lg:ml-0 lg:mt-0 lg:space-y-0 lg:hidden': isCollapsed }"
          >
            <AppSidebarMenuItem
              v-for="(child, childIndex) in item.children"
              :key="`${sectionIndex}-${itemIndex}-child-${childIndex}`"
              :item="child"
              :is-collapsed="isCollapsed"
              :is-active="isItemActive(child)"
              @click="handleItemClick"
            />
          </ul>
        </AppSidebarMenuItem>
      </ul>
    </template>
  </nav>
</template>
