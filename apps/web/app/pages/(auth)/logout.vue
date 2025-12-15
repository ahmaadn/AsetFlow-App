<script setup lang="ts">
const auth = useAuth();
auth.setRefreshToken(null);
auth.setAccessToken(null);
await auth.logout();
await navigateTo('/login');
</script>
<template>
  <p>Logging out...</p>
</template>
