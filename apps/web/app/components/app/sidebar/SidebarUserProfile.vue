<script setup lang="ts">
interface User {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}

interface Props {
  user?: User | null;
  isCollapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
  user: null,
  isCollapsed: false,
});
</script>

<template>
  <!-- Loading State -->
  <div
    v-if="!user"
    class="flex items-center gap-3 w-full"
    :class="{ 'justify-center': isCollapsed }"
  >
    <div class="skeleton w-10 h-10 rounded-full shrink-0"></div>
    <div
      class="flex flex-col gap-2 min-w-0 flex-1"
      :class="{ 'lg:hidden': isCollapsed }"
    >
      <div class="skeleton h-4 w-20"></div>
      <div class="skeleton h-3 w-28"></div>
    </div>
  </div>

  <!-- User Profile -->
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
          :src="user.avatar || `https://i.pravatar.cc/150?u=${user.email}`"
          :alt="user.name || 'User'"
        />
      </div>
    </div>
    <div
      class="flex flex-col min-w-0 transition-opacity duration-300"
      :class="{ 'lg:hidden': isCollapsed }"
    >
      <div class="font-bold text-sm truncate leading-tight">
        {{ user.name || 'User' }}
      </div>
      <div class="text-xs text-base-content/60 truncate">
        {{ user.email || 'user@example.com' }}
      </div>
    </div>
  </div>
</template>
