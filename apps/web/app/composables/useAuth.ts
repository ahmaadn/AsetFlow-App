import type { User } from '@asetflow/shared-types';
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
  const { $client } = useNuxtApp();

  // Use consistent state management across server and client
  const session =
    useState<InferSessionFromClient<BetterAuthClientOptions> | null>(
      'auth:session',
      () => null
    );
  const user = useState<User | null>('auth:user', () => null);

  const fetchSession = async () => {
    try {
      const { data } = await $client.getSession();
      console.log('Fetched session data:', data);

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
      return null;
    }
  };

  const handleSignOut = async () => {
    session.value = null;
    user.value = null;
    await $client.signOut();
  };

  return {
    client: $client,
    session,
    fetchSession,
    handleSignOut,
    user,
    isAuthenticated: computed(() => !!session.value),
  };
}
