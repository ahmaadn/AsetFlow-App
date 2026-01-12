<script setup lang="ts">
import type { MenuItem } from '~/types';

interface Props {
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: 'app-sidebar',
});

const route = useRoute();
const { user } = useAuth();
const { isCollapsed, menuSections } = useAppState();

const activeMenuItem = computed((): MenuItem | null => {
  for (const section of menuSections.value) {
    const activeItem = section.items.find(
      (item) => item.to && isActiveLink(item.to)
    );
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
  if (item.action && typeof item.action === 'function') {
    item.action();
  }
};

// Dummy data for sidebar footer
const dummyStorage = {
  used: 7.2,
  total: 10,
  percentage: 72,
};

const getLinkClass = (item: MenuItem) => {
  return {
    'text-primary bg-base-200 hover:bg-base-300 border-l-4 border-primary group-[.is-collapsed]:lg:border-l-0 group-[.is-collapsed]:lg:bg-primary/10':
      item.to && isActiveLink(item.to),
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
        <div
          class="p-4 flex items-center gap-x-2 font-brand border-b border-base-300 overflow-hidden whitespace-nowrap group-[.is-collapsed]:lg:justify-center"
        >
          <div
            class="flex items-center justify-center size-10 bg-primary/20 rounded-md shrink-0"
          >
            <UiLogo class="h-8 w-8" />
          </div>
          <span
            class="font-bold text-2xl transition-opacity duration-300 opacity-100 group-[.is-collapsed]:lg:hidden group-[.is-collapsed]:lg:opacity-0 group-[.is-collapsed]:lg:w-0"
            >AsetFlow</span
          >
        </div>

        <!-- Menu Sections -->
        <nav
          class="flex-1 overflow-y-auto overflow-x-hidden group-[.is-collapsed]:lg:overflow-visible group-[.is-collapsed]:lg:flex group-[.is-collapsed]:lg:flex-col group-[.is-collapsed]:lg:items-center"
        >
          <template
            v-for="(section, sectionIndex) in menuSections"
            :key="section.title"
          >
            <ul
              class="menu px-4 pt-2 pb-0 w-full gap-y-1 group-[.is-collapsed]:lg:w-fit group-[.is-collapsed]:lg:px-2 last:pb-2"
            >
              <li v-if="section.title">
                <h2 class="menu-title group-[.is-collapsed]:lg:hidden">
                  {{ section.title }}
                </h2>
                <div
                  class="hidden group-[.is-collapsed]:lg:px-0 group-[.is-collapsed]:lg:block"
                >
                  <div class="divider my-0"></div>
                </div>
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
                  <Icon :name="item.icon" class="size-5 shrink-0" />
                  <span
                    class="flex-1 truncate group-[.is-collapsed]:lg:hidden group-[.is-collapsed]:lg:w-0 group-[.is-collapsed]:lg:opacity-0"
                    >{{ item.label }}</span
                  >
                  <Icon
                    v-if="item.external"
                    name="ri:external-link-line"
                    class="size-4 opacity-50 group-[.is-collapsed]:lg:hidden"
                  />
                  <span
                    v-if="item.badge"
                    class="badge badge-sm badge-primary group-[.is-collapsed]:lg:hidden"
                  >
                    {{ item.badge }}
                  </span>
                </a>

                <!-- Internal Link -->
                <NuxtLink
                  v-else
                  :to="item.to"
                  :class="[
                    getLinkClass(item),
                    'group-[.is-collapsed]:lg:justify-center group-[.is-collapsed]:lg:p-2',
                  ]"
                  :aria-current="
                    item.to && isActiveLink(item.to) ? 'page' : undefined
                  "
                  :tabindex="item.disabled ? -1 : 0"
                  @click="handleItemClick(item)"
                >
                  <Icon :name="item.icon" class="size-5 shrink-0" />
                  <span
                    class="flex-1 truncate group-[.is-collapsed]:lg:hidden group-[.is-collapsed]:lg:w-0 group-[.is-collapsed]:lg:opacity-0"
                    >{{ item.label }}</span
                  >
                  <span
                    v-if="item.badge"
                    class="badge badge-sm badge-primary group-[.is-collapsed]:lg:hidden"
                  >
                    {{ item.badge }}
                  </span>
                  <!-- <span
                    v-if="item.to === '/dashboard'"
                    class="badge badge-xs badge-success animate-pulse group-[.is-collapsed]:lg:hidden"
                  ></span> -->
                </NuxtLink>
              </li>
            </ul>
          </template>
        </nav>

        <!-- Footer / User & Storage -->
        <div
          class="p-4 border-t border-base-300 overflow-hidden flex flex-col gap-4 bg-base-100 shrink-0"
          :class="{ 'items-center px-2 py-4': isCollapsed }"
        >
          <!-- Storage Widget -->
          <div
            class="bg-base-200 rounded-xl p-4 flex flex-col gap-2 group-[.is-collapsed]:lg:hidden"
          >
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-base-content/70">STORAGE</span>
              <span>{{ dummyStorage.percentage }}%</span>
            </div>
            <progress
              class="progress progress-primary w-full h-2"
              :value="dummyStorage.percentage"
              max="100"
            ></progress>
            <div class="text-xs text-base-content/60">
              {{ dummyStorage.used }} GB of {{ dummyStorage.total }} GB used
            </div>
            <button
              class="btn btn-xs btn-outline btn-primary w-full mt-1 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-content"
            >
              Upgrade Plan
            </button>
          </div>

          <!-- User Profile -->
          <div
            v-if="!user"
            class="flex items-center gap-3 w-full"
            :class="{ 'justify-center': isCollapsed }"
          >
            <div class="skeleton w-10 h-10 rounded-full shrink-0"></div>
            <div
              class="flex flex-col gap-2 min-w-0 flex-1 group-[.is-collapsed]:lg:hidden"
            >
              <div class="skeleton h-4 w-20"></div>
              <div class="skeleton h-3 w-28"></div>
            </div>
          </div>

          <div
            v-else
            class="flex items-center gap-3 w-full"
            :class="{ 'justify-center': isCollapsed }"
          >
            <div class="avatar placeholder shrink-0">
              <div
                class="bg-neutral text-neutral-content rounded-full w-10 ring ring-base-300 ring-offset-2 ring-offset-base-100"
              >
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  :alt="user.name || 'User'"
                />
              </div>
            </div>
            <div
              class="flex flex-col min-w-0 transition-opacity duration-300 group-[.is-collapsed]:lg:hidden"
            >
              <div class="font-bold text-sm truncate leading-tight">
                {{ user.name || 'User' }}
              </div>
              <div class="text-xs text-base-content/60 truncate">
                {{ user.email || 'user@example.com' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
