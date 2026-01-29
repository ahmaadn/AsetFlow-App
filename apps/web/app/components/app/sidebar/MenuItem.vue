<script setup lang="ts">
import type { MenuItem } from '~/types';

interface Props {
  item: MenuItem;
  isCollapsed?: boolean;
  isActive?: boolean;
  isChild?: boolean;
  hasChildren?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  isActive: false,
  isChild: false,
  hasChildren: false,
});

const emit = defineEmits<{
  click: [item: MenuItem];
}>();

const linkClass = computed(() => {
  const activeClass = props.isChild
    ? 'text-primary bg-primary/10'
    : 'text-primary bg-base-200 hover:bg-base-300 border-l-4 border-primary group-[.is-collapsed]:lg:border-l-0 group-[.is-collapsed]:lg:bg-primary/10';

  return {
    [activeClass]: props.isActive,
    'opacity-50 cursor-not-allowed': props.item.disabled,
  };
});

const handleClick = () => {
  if (props.item.action && typeof props.item.action === 'function') {
    props.item.action();
  }
  emit('click', props.item);
};
</script>

<template>
  <li>
    <!-- Without Children: Direct Link -->
    <template v-if="!hasChildren">
      <!-- External Link -->
      <a
        v-if="item.external"
        :href="item.to"
        target="_blank"
        rel="noopener noreferrer"
        :class="linkClass"
        @click="handleClick"
      >
        <Icon :name="item.icon" class="size-5 shrink-0" />
        <span
          class="flex-1 truncate"
          :class="{
            'lg:hidden lg:w-0 lg:opacity-0': isCollapsed,
          }"
        >
          {{ item.label }}
        </span>
        <Icon
          name="ri:external-link-line"
          class="size-4 opacity-50"
          :class="{ 'lg:hidden': isCollapsed }"
        />
        <span
          v-if="item.badge"
          class="badge badge-sm badge-primary"
          :class="{ 'lg:hidden': isCollapsed }"
        >
          {{ item.badge }}
        </span>
      </a>

      <!-- Internal Link -->
      <NuxtLink
        v-else
        :to="item.to"
        :class="[linkClass, { 'lg:justify-center lg:p-2': isCollapsed }]"
        :aria-current="isActive ? 'page' : undefined"
        :tabindex="item.disabled ? -1 : 0"
        @click="handleClick"
      >
        <Icon :name="item.icon" class="size-5 shrink-0" />
        <span
          class="flex-1 truncate"
          :class="{
            'lg:hidden lg:w-0 lg:opacity-0': isCollapsed,
          }"
        >
          {{ item.label }}
        </span>
        <span
          v-if="item.badge"
          class="badge badge-sm badge-primary"
          :class="{ 'lg:hidden': isCollapsed }"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </template>

    <!-- With Children: Collapsible Details -->
    <details v-else class="group/details" :open="isActive">
      <summary
        :class="[
          linkClass,
          'list-none cursor-pointer flex items-center gap-2',
          { 'lg:justify-center lg:p-2 lg:after:hidden': isCollapsed },
        ]"
        @click="handleClick"
      >
        <NuxtLink :to="item.to" class="flex items-center gap-2 flex-1">
          <Icon :name="item.icon" class="size-5 shrink-0" />
          <span
            class="flex-1 truncate"
            :class="{
              'lg:hidden lg:w-0 lg:opacity-0': isCollapsed,
            }"
          >
            {{ item.label }}
          </span>
          <span
            v-if="item.badge"
            class="badge badge-sm badge-primary"
            :class="{ 'lg:hidden': isCollapsed }"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </summary>
      <slot></slot>
    </details>
  </li>
</template>
