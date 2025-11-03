<script setup lang="ts">
const auth = useAuth();
await auth.logout();
navigateTo('/login');
</script>

<template>
  <div>Logging out...</div>
</template>
