/**
 * Composable untuk mengelola autentikasi pengguna.
 * Menggunakan cookie untuk menyimpan token autentikasi.
 */
export function useAuth() {
  const tokenCookie = useCookie<string | null>('auth-token', {
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    secure: true,
  });

  const authUser = useState<{ sub: string; email: string } | null>(
    'auth_user',
    () => null
  );

  const isAuthenticated = computed(() => {
    return !!tokenCookie.value && isTokenValid(tokenCookie.value);
  });

  const init = async () => {
    const cookieToken = tokenCookie.value;
    if (!cookieToken) {
      return;
    }

    const payload = decodeToken(cookieToken) as PayloadWithEmail | null;
    if (!payload) {
      return;
    }

    // cek valid payload
    if (!isValidPayload(payload)) {
      return;
    }

    if (payload.sub && payload.email) {
      // Simpan payload ke state reaktif
      authUser.value = { sub: payload.sub, email: payload.email };
    }
  };

  const logout = () => {
    tokenCookie.value = null;
    authUser.value = null;
  };

  const setToken = (newToken: string | null) => {
    const payload = decodeToken(newToken || '') as PayloadWithEmail | null;
    if (!payload) {
      return;
    }

    // cek valid payload
    if (!isValidPayload(payload)) {
      return;
    }

    if (payload.sub && payload.email) {
      // Simpan payload ke state reaktif
      authUser.value = { sub: payload.sub, email: payload.email };
    }

    tokenCookie.value = newToken;
  };

  const clearToken = () => {
    tokenCookie.value = null;
  };

  return {
    tokenCookie,
    authUser,
    isAuthenticated,

    init,
    logout,
    setToken,
    clearToken,
  };
}
