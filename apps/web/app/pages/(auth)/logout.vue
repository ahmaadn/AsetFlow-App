<script setup lang="ts">
const auth = useAuth();
const $api = useNuxtApp().$api;
try {
  await $api('/v1/auth/logout', {
    method: 'POST',
    body: {
      refreshToken: auth.refreshToken.value,
    },
  });
} catch (error) {
  console.error('Logout failed:', error);
  // Handle error if needed
}
auth.setRefreshToken(null);
auth.setAccessToken(null);
await navigateTo('/login');
</script>
<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Logging you out...
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Please wait a moment while we log you out of your account.
        </p>
      </div>
    </div>
  </div>
</template>
