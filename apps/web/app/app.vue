<script setup lang="ts">
// 1. Impor composable useAuth
const { init } = useAuth();

// 'await' akan memastikan data pengguna (jika ada)
// sudah dimuat sebelum halaman pertama di-render di sisi server.
await init();
</script>

<template>
  <div>
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <UiToastContainer class="fixed z-100" />
  </div>
</template>
