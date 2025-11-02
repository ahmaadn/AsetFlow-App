const publicRoutes = ['/login', '/404'];

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuth();

  // Jika pengguna sudah login dan mencoba mengakses halaman '/login' lagi,
  // arahkan mereka kembali ke halaman sebelumnya atau ke dashboard.
  if (to.path === '/login' && auth.isAuthenticated.value) {
    const previous =
      from?.fullPath && from.fullPath !== to.fullPath
        ? from.fullPath
        : '/dashboard';
    return navigateTo(previous);
  }

  // Jika pengguna belum login dan mencoba mengakses halaman yang bukan publik,
  // biarkan mereka mengakses halaman publik.
  if (matches(publicRoutes, to.path)) {
    return;
  }

  // Jika pengguna belum login dan mencoba mengakses halaman yang bukan publik,
  // arahkan mereka ke halaman login.
  if (!auth.isAuthenticated.value) {
    auth.logout();
    return navigateTo('/login');
  }
});
