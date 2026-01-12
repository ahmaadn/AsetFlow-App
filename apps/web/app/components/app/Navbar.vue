<script setup lang="ts">
interface Props {
  drawerId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  drawerId: 'app-sidebar',
});

const { isCollapsed, toggle, getLabelByRoute } = useAppState();
const route = useRoute();

const breadcrumbs = computed(() => {
  const path = route.path;
  const parts = path.split('/').filter(Boolean);

  const items = parts.map((part, index) => {
    const to = '/' + parts.slice(0, index + 1).join('/');

    // Check sidebar for label first, otherwise format path part
    let label = getLabelByRoute(to);

    if (!label) {
      label = part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return {
      label,
      to,
    };
  });

  return [{ label: 'Home', to: '/dashboard' }, ...items];
});
</script>

<template>
  <div
    class="navbar bg-base-100 border-b border-base-200 h-16 min-h-16 px-4 gap-4 z-10 shadow-sm"
  >
    <!-- Toggle & Breadcrumbs -->
    <div class="flex-1 flex items-center gap-2">
      <label
        :for="props.drawerId"
        class="btn btn-square btn-ghost drawer-button lg:hidden"
      >
        <Icon name="ri:menu-line" class="h-5 w-5" />
      </label>

      <button class="btn btn-square btn-ghost hidden lg:flex" @click="toggle">
        <Icon
          :name="isCollapsed ? 'ri:menu-unfold-line' : 'ri:menu-fold-line'"
          class="h-5 w-5 text-base-content/70"
        />
      </button>

      <div class="text-sm breadcrumbs hidden md:block ml-2">
        <ul>
          <li v-for="(crumb, index) in breadcrumbs" :key="crumb.to">
            <span
              v-if="index === breadcrumbs.length - 1"
              class="font-semibold text-base-content"
            >
              {{ crumb.label }}
            </span>
            <NuxtLink
              v-else
              :to="crumb.to"
              class="text-base-content/60 no-underline hover:text-primary"
            >
              {{ crumb.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- Center: Search
    <div class="flex-1 flex justify-center px-4">
      <div class="relative w-full max-w-xl">
        <label
          class="input input-bordered flex items-center gap-3 w-full h-10 bg-base-100 hover:bg-base-200/50 focus-within:!bg-base-100 transition-colors shadow-sm"
        >
          <Icon name="ri:search-line" class="h-4 w-4 opacity-50" />
          <input
            type="text"
            class="grow text-sm placeholder:text-base-content/40"
            placeholder="Search assets, folders, and tags..."
          />
          <span class="flex items-center gap-1">
            <kbd
              class="kbd kbd-sm h-5 min-h-0 text-[10px] bg-base-200 border-base-300 text-base-content/60 font-sans"
              >⌘K</kbd
            >
          </span>
        </label>
      </div>
    </div> -->

    <!-- Right: Actions -->
    <!-- <div class="flex-none flex items-center gap-2">
      <button class="btn btn-ghost btn-circle btn-sm">
        <div class="indicator">
          <Icon
            name="ri:notification-3-line"
            class="h-5 w-5 text-base-content/70"
          />
          <span
            class="badge badge-xs badge-error indicator-item border-base-100"
          ></span>
        </div>
      </button>
    </div> -->
  </div>
</template>
