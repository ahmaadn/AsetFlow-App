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

/**
 * Main authentication composable providing reactive auth state and methods.
 */
export function useAuth() {
  const config = useRuntimeConfig();

  // Improved header forwarding for SSR
  const headers = import.meta.server
    ? useRequestHeaders([
        'cookie',
        'authorization',
        'user-agent',
        'x-forwarded-for',
        'x-forwarded-proto',
      ])
    : undefined;

  const client = createAuthClient({
    baseURL: config.public.apiBase,
    basePath: '/v1/auth',
    fetchOptions: {
      headers,
      credentials: 'include', // Ensure cookies are included
    },
  });

  // Use consistent state management across server and client
  const session =
    useState<InferSessionFromClient<BetterAuthClientOptions> | null>(
      'auth:session',
      () => null
    );
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

      const { data } = await client.getSession();

      // Handle session data consistently
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

      return data;
    } catch (error) {
      console.warn('Session fetch failed:', error);
      // Don't clear session on fetch error to prevent auth loops
      return null;
    } finally {
      sessionFetching.value = false;
    }
  };

  const handleSignOut = async () => {
    // clearApplicationStores();
    session.value = null;
    user.value = null;
    await client.signOut();
    await navigateTo('/login');
  };

  const setSession = (
    newSession: InferSessionFromClient<BetterAuthClientOptions> | null
  ) => {
    session.value = newSession;
  };

  const setUser = (newUser: User | null) => {
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
  };

  return {
    client,
    session,
    setSession,
    setUser,
    fetchSession,
    handleSignOut,
    user,
    isAuthenticated: computed(() => !!session.value),
  };
}
