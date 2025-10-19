const publicRoutes = ['/login', '/404'];

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();

  // Panggil 'useAuthStore' dan berikan instance Pinia ($pinia) dari nuxtApp.
  const authStore = useAuthStore(nuxtApp.$pinia);

  console.log(
    `Navigating to ${to.path}. Is authenticated: ${authStore.isAuthenticated}`
  );

  // Jika pengguna sudah login dan mencoba mengakses halaman '/login' lagi,
  // arahkan mereka kembali ke halaman sebelumnya atau ke dashboard.
  if (to.path === '/login' && authStore.isAuthenticated) {
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
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }
});
