<script setup lang="ts">
const { getUser } = useAuth();

onMounted(async () => {
  await getUser();
});
</script>
<template>
  <div>
    <div class="main-content relative">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <div id="overlay"></div>
    <AppModalContainer class="z-50" />
    <UiToastContainer class="fixed z-100" position="top-right" />
    <UiUploadedToast />
  </div>
</template>
