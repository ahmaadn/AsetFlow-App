import type { User } from '@asetflow/shared-types';
import { createAuthClient } from 'better-auth/vue';

/**
 * Clears all application stores when user logs out.
 * Follows separation of concerns by isolating cleanup logic.
 *
 * @private
 */
function clearApplicationStores(): void {
  const { clear: clearFolder } = useFolderStore();
  const { clear: clearAsset } = useAssetStore();
  const { clear: clearStagingFiles } = useStaggingFilesStore();
  const { closeAll: closeModals } = useModal();
  const { cancelAllUploadTasks } = useUploadQueue();

  try {
    clearFolder();
  } catch (error) {
    console.warn('Failed to clear folder store:', error);
  }
  try {
    clearAsset();
  } catch (error) {
    console.warn('Failed to clear asset store:', error);
  }
  try {
    clearStagingFiles();
  } catch (error) {
    console.warn('Failed to clear staging files store:', error);
  }
  try {
    closeModals();
  } catch (error) {
    console.warn('Failed to close modals:', error);
  }
  try {
    cancelAllUploadTasks();
  } catch (error) {
    console.warn('Failed to cancel upload tasks:', error);
  }
}

/**
 * Main authentication composable providing reactive auth state and methods.
 */
export function useAuth() {
  const config = useRuntimeConfig();
  const { auth } = useApi();

  // Keep better-auth client for other auth operations (sign in, sign up, etc.)
  const client = createAuthClient({
    baseURL: config.public.apiBase,
    basePath: '/v1/auth',
    fetchOptions: {
      credentials: 'include',
    },
  });

  // Use consistent state management across server and client
  const session = useState<any>('auth:session', () => null);
  const user = useState<User | null>('auth:user', () => null);

  // Fix sessionFetching state to prevent hydration mismatch
  const sessionFetching = useState<boolean>(
    'auth:session-fetching',
    () => false
  );

  const fetchSession = async () => {
    // Prevent concurrent session fetches
    if (sessionFetching.value) return;

    try {
      sessionFetching.value = true;

      // Use manual fetch instead of better-auth getSession
      const response = await auth.getSession();

      if (response.error) {
        console.warn('Session fetch failed:', response.error);
        // Clear session on auth error
        session.value = null;
        user.value = null;
        return null;
      }

      const data = response.data;
      const newSession = data?.session || null;
      const newUser = data?.user || null;

      // Only update state if there's a change to prevent unnecessary reactivity
      if (JSON.stringify(session.value) !== JSON.stringify(newSession)) {
        session.value = newSession;
      }

      if (JSON.stringify(user.value) !== JSON.stringify(newUser)) {
        const userDefault = {
          id: null,
          createdAt: null,
          updatedAt: null,
          email: null,
          emailVerified: null,
          name: null,
          image: null,
        };
        user.value = newUser ? Object.assign({}, userDefault, newUser) : null;
      }

      return { data };
    } catch (error) {
      console.warn('Session fetch failed:', error);
      // Clear session on unexpected error
      session.value = null;
      user.value = null;
      return null;
    } finally {
      sessionFetching.value = false;
    }
  };

  const handleSignOut = async () => {
    try {
      clearApplicationStores();
      session.value = null;
      user.value = null;

      // Use manual fetch for sign out
      await auth.signOut();

      await navigateTo('/login');
    } catch (error) {
      console.warn('Sign out failed:', error);
      // Force navigate to login even if sign out fails
      await navigateTo('/login');
    }
  };

  return {
    client,
    session,
    fetchSession,
    handleSignOut,
    user,
    isAuthenticated: computed(() => !!session.value),
  };
}
