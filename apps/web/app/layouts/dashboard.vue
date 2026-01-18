<script setup lang="ts"></script>

<template>
  <app-sidebar id="dashboard-drawer">
    <app-navbar drawer-id="dashboard-drawer" />
    <div class="relative">
      <div class="m-6 md:m-8 mb-20 min-h-[calc(100dvh-4.5rem)]">
        <slot />
      </div>
    </div>
  </app-sidebar>
</template>
