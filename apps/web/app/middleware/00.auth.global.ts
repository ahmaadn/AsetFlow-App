import { verifyJWT, isExpired } from '@asetflow/shared';

/**
 * Public routes that don't require authentication.
 * These routes are accessible to both authenticated and unauthenticated users.
 */
const PUBLIC_ROUTES: string[] = ['/404', '/500', '/logout'] as const;

/**
 * Authentication routes that authenticated users shouldn't access.
 * These routes are only for unauthenticated users.
 */
const AUTH_ROUTES: string[] = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
] as const;

/**
 * Default redirect path for authenticated users.
 */
const DEFAULT_AUTHENTICATED_REDIRECT: string = '/dashboard';

/**
 * Global authentication middleware.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();

  if (PUBLIC_ROUTES.includes(to.path)) {
    return;
  }
  if (!auth.hasRefreshToken.value) {
    if (PUBLIC_ROUTES.includes(to.path) || AUTH_ROUTES.includes(to.path)) {
      return;
    }
    // User is not authenticated and trying to access a protected route
    return navigateTo(`/logout`);
  }

  // coba refresh token jika access token tidak ada atau sudah expired
  let isRefresh = false;
  if (
    (auth.hasRefreshToken.value && !auth.hasAccessToken.value) ||
    (auth.isAuthenticated.value && isExpired(auth.accessToken.value!))
  ) {
    try {
      // sini otomatis set access token di dalamnya
      // jika error di backend misalnya refresh token invalid atau expired akan throw error dan
      // tidak lagi menyimpan access dan refresh token
      await auth.refresh();
      isRefresh = true;
    } catch (error) {
      // ada 2 kondisi disini, error fetch dan error response dari api
      // jika fetch error misal network error, biarkan user di halaman sekarang
      // jika error response dari api misal 403, redirect ke logout
      // tapi untuk sekarang langsung redirect ke logout saja
      return navigateTo('/logout');
    }
  }

  const config = useRuntimeConfig();
  // verify again after refresh
  // IMPORTANT: di frontend hanya melakukan pengecekan access token saja
  // untuk refresh token pengecekan dilakukan di backend
  if (auth.isAuthenticated.value && isRefresh) {
    const isValid = await verifyJWT({
      publicKey: config.public.jwtPublicKey,
      token: auth.accessToken.value!,
      expectedIssuer: config.public.jwtIssuer,
      expectedAudience: config.public.jwtAudience,
    });

    // if trying to access auth routes while authenticated, redirect to dashboard
    if (!isValid) {
      return navigateTo('/logout');
    }
  }

  if (AUTH_ROUTES.includes(to.path)) {
    return navigateTo(DEFAULT_AUTHENTICATED_REDIRECT);
  }
  if (!auth.isAuthenticated.value) {
    return navigateTo('/logout');
  }
  return;
});
