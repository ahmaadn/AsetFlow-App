import type { RouteLocationNormalizedGeneric } from 'vue-router';

/**
 * Public routes that don't require authentication.
 * These routes are accessible to both authenticated and unauthenticated users.
 */
const PUBLIC_ROUTES: string[] = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/404',
  '/500',
] as const;

/**
 * Authentication routes that authenticated users shouldn't access.
 * These routes are only for unauthenticated users.
 */
const AUTH_ROUTES: string[] = ['/login', '/register'] as const;

/**
 * Default redirect path for authenticated users.
 */
const DEFAULT_AUTHENTICATED_REDIRECT: string = '/dashboard';

/**
 * Determines the best redirect path for authenticated users trying to access auth pages.
 *
 * @param from - The route user came from
 * @returns {string} The redirect path
 */
function getAuthenticatedRedirectPath(
  from: RouteLocationNormalizedGeneric
): string {
  // If user came from a valid non-auth route, redirect back there
  if (
    from?.fullPath &&
    from.fullPath !== '/login' &&
    from.fullPath !== '/register' &&
    !PUBLIC_ROUTES.includes(from.fullPath)
  ) {
    return from.fullPath;
  }

  // Otherwise redirect to dashboard
  return DEFAULT_AUTHENTICATED_REDIRECT;
}

/**
 * Global authentication middleware.
 *
 * Handles route protection and redirects based on authentication state:
 * - Redirects authenticated users away from auth pages (login/register)
 * - Allows access to public routes for everyone
 * - Redirects unauthenticated users to login for protected routes
 *
 * @param to - Target route
 * @param from - Current route
 *
 * @example
 * This middleware runs automatically on all route changes.
 * No manual setup required.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth();

  try {
    await auth.fetchSession();

    if (auth.isAuthenticated.value) {
      if (AUTH_ROUTES.includes(to.path)) {
        const redirectPath = getAuthenticatedRedirectPath(from);
        return navigateTo(redirectPath, { replace: true });
      }

      return;
    }

    // Allow access to public routes
    if (PUBLIC_ROUTES.includes(to.path)) {
      return;
    }

    // Redirect unauthenticated users to login for protected routes
    return navigateTo('/login', { replace: true });
  } catch (error) {
    console.error(
      `Authentication middleware failed during session fetch or auth check for route "${to.path}".`,
      error
    );
    // Only redirect to login if not already on a public route
    if (!PUBLIC_ROUTES.includes(to.path)) {
      return navigateTo('/login', { replace: true });
    }
  }
});
