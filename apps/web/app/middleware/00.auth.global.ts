/**
 * Public routes that don't require authentication.
 * These routes are accessible to both authenticated and unauthenticated users.
 */
const PUBLIC_ROUTES: string[] = [
  '/login',
  '/register',
  '/logout',
  '/forgot-password',
  '/reset-password',
  '/404',
  '/500',
] as const;

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
export default defineNuxtRouteMiddleware((to) => {
  // Allow access to public routes, except auth routes for authenticated users
  if (
    PUBLIC_ROUTES.includes(to.fullPath) &&
    !AUTH_ROUTES.includes(to.fullPath)
  ) {
    return;
  }

  const auth = useAuthStore();

  if (!auth.isAuthenticated) {
    // Allow unauthenticated users to access public routes
    if (
      PUBLIC_ROUTES.includes(to.fullPath) ||
      AUTH_ROUTES.includes(to.fullPath)
    ) {
      return;
    }

    return navigateTo('/login', { replace: true });
  }

  // Redirect authenticated users away from auth routes
  if (AUTH_ROUTES.includes(to.fullPath)) {
    return navigateTo(DEFAULT_AUTHENTICATED_REDIRECT, { replace: true });
  }
  return;
});
