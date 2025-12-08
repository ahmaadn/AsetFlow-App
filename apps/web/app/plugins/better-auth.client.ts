export default defineNuxtPlugin({
  name: 'better-auth-setup',
  setup() {
    if (import.meta.client) {
      // Ensure cookies are properly handled on client side
      const { client } = useAuth();

      // Listen for auth events to refresh session
      client.$store.listen('$sessionSignal', async (signal) => {
        if (signal) {
          const { fetchSession } = useAuth();
          await nextTick();
          await fetchSession();
        }
      });
    }
  },
});
