import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null as { name: string; email: string } | null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    login(userData: { name: string; email: string }) {
      this.isLoggedIn = true;
      this.user = userData;
      console.log('User logged in:', this.user);
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
      console.log('User logged out.');
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
