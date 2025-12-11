export const useAuthStore = defineStore('auth', () => {
  const authClient = useAuthClient();

  type Session = typeof authClient.$Infer.Session;
  const session = ref<Session | null>(null);

  const getSession = async () => {
    const response = await authClient.getSession();
    if (response.error) {
      session.value = null;
      return null;
    }
    session.value = response.data;
    return session.value;
  };

  const getSessionToken = (): string | undefined => {
    return session.value?.session.token || undefined;
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await authClient.signIn.email({
        email,
        password,
      });
      await getSession();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      session.value = null;
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const signUpWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await authClient.signUp.email({
        name,
        email,
        password,
      });
      await getSession();
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const currentUser = computed(() => session.value?.user || null);
  const isAuthenticated = computed(() => !!session.value);

  return {
    session,
    currentUser,
    isAuthenticated,
    getSession,
    getSessionToken,
    signUpWithEmailAndPassword,
    loginWithEmailAndPassword,
    signOut,
  };
});
