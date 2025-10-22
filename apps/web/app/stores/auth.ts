import type { AuthTokens } from '@asetflow/shared-types';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    accessToken: null as string | null,
    user: null as { name: string; email: string } | null,
  }),

  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
  },

  actions: {
    setTokens(data: AuthTokens) {
      this.isLoggedIn = true;
      this.accessToken = data.accessToken;
    },
    login(userData: { name: string; email: string }) {
      this.isLoggedIn = true;
      this.user = userData;
    },
    logout() {
      this.isLoggedIn = false;
      this.user = null;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
});
