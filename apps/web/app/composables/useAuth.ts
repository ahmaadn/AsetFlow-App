import type { User } from '@asetflow/shared-types';
import { createAuthClient } from 'better-auth/vue';
import type {
  InferSessionFromClient,
  BetterAuthClientOptions,
} from 'better-auth/client';

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

  // Forward incoming request headers (cookies) to auth client for SSR
  const headers = import.meta.server ? useRequestHeaders() : undefined;

  // Use proxy URL for client-side requests to avoid CORS issues
  const baseURL = import.meta.client
    ? config.public.apiBase
    : config.apiBaseServer;
  const basePath = '/v1/auth';
  const client = createAuthClient({
    baseURL,
    basePath,
    fetchOptions: {
      ...headers,
      credentials: 'include',
    },
  });
  const session =
    useState<InferSessionFromClient<BetterAuthClientOptions> | null>(
      'auth:session',
      () => null
    );
  const user = useState<User | null>('auth:user', () => null);
  const sessionFetching = import.meta.server
    ? ref(false)
    : useState<boolean>('auth:session-fetched', () => false);

  const fetchSession = async () => {
    if (sessionFetching.value) return;

    sessionFetching.value = true;
    const { data } = await client.getSession();
    session.value = data?.session || null;

    const userDefault = {
      id: null,
      createdAt: null,
      updatedAt: null,
      email: null,
      emailVerified: null,
      name: null,
      image: null,
    };

    user.value = data?.user ? Object.assign({}, userDefault, data.user) : null;
    sessionFetching.value = false;
    return data;
  };

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal) return;
      await fetchSession();
    });
  }

  const handleSignOut = async () => {
    clearApplicationStores();
    session.value = null;
    user.value = null;
    await client.signOut();
    await navigateTo('/login');
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
