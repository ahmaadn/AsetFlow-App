<script setup lang="ts">
const auth = useAuthStore();
await auth.signOut();
await navigateTo('/login');
</script>
