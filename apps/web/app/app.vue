<script setup lang="ts">
// 1. Impor composable useAuth
const { init } = useAuth();

// 'await' akan memastikan data pengguna (jika ada)
// sudah dimuat sebelum halaman pertama di-render di sisi server.
await init();
</script>

<template>
  <div>
    <div class="main-content relative">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <div id="modal-container" class="fixed z-50"></div>
    <UiToastContainer class="fixed z-100" position="top-right" />
    <UiUploadedToast />
  </div>
</template>
