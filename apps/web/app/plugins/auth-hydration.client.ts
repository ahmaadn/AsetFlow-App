/**
 * Auth hydration plugin
 * Ensures smooth authentication state transition between server and client
 */
export default defineNuxtPlugin({
  name: 'auth-hydration',
  parallel: true,
  async setup() {
    // Only run on client-side
    if (import.meta.server) return;

    const { fetchSession } = useAuth();

    // Wait for hydration to complete before fetching session
    await nextTick();

    try {
      // Fetch session after hydration to ensure consistency
      await fetchSession();

      // Mark auth as hydrated
      useState('auth:hydrated', () => true);
    } catch (error) {
      console.warn('Auth hydration failed:', error);
      // Don't throw error to prevent app crash
    }
  },
});
