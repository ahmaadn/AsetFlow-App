<script setup lang="ts">
const auth = useAuthStore();

await auth.getSession();
</script>

<template>
  <div>
    <div class="main-content relative">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <div id="modal-container" class="fixed z-50">
      <AppModalContainer />
    </div>
    <UiToastContainer class="fixed z-100" position="top-right" />
    <UiUploadedToast />
  </div>
</template>
