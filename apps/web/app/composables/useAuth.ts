import {
  decodeJWT,
  ErrorCode,
  type AccessTokenPayload,
  type ApiErrorResponse,
} from '@asetflow/shared';
import type {
  AccessTokenCredentials,
  AccessTokenResponse,
  PayloadTokenResponse,
  UserInfoResponses,
} from '@asetflow/shared-types';
import { useFetchAPI } from './useApiFetch';

/**
 * Main authentication composable providing reactive auth state and methods.
 */
export function useAuth() {
  const accessToken = useCookie<string | null>('auth.access_token', {
    secure: true,
    maxAge: 30 * 60, // 30 minutes
  });
  const refreshToken = useCookie<string | null>('auth.refresh_token', {
    secure: true,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  const user = useState<UserInfoResponses | null>('auth_user', () => null);
  const isAuthenticated = computed(
    () => !!accessToken.value && !!refreshToken.value
  );
  const hasRefreshToken = computed(() => !!refreshToken.value);
  const hasAccessToken = computed(() => !!accessToken.value);

  const setAccessToken = (token: string | null) => {
    accessToken.value = token;

    if (!token) {
      user.value = null;
      return;
    }

    const payload =
      decodeJWT<AccessTokenPayload<AccessTokenCredentials>>(token);

    user.value = {
      id: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  };

  const setRefreshToken = (token: string | null) => {
    refreshToken.value = token;
  };

  const setTokens = (tokens: PayloadTokenResponse) => {
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  const initial = () => {
    if (!accessToken.value) {
      return;
    }

    // Initialize user from existing token
    setAccessToken(accessToken.value);
  };

  const refresh = async () => {
    const $api = useNuxtApp().$api;

    try {
      const response = await $api<AccessTokenResponse>('/v1/auth/refresh', {
        method: 'POST',
        body: {
          refreshToken: refreshToken.value,
        },
      });
      setAccessToken(response.accessToken);
      return response;
    } catch (error) {
      if (isFetchError<ApiErrorResponse>(error)) {
        const resErr = error.response;
        if (
          resErr?._data?.errorCode === ErrorCode.TOKEN_EXPIRED ||
          resErr?._data?.errorCode === ErrorCode.UNAUTHORIZED
        ) {
          setAccessToken(null);
          setRefreshToken(null);
        }
      }
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    const { data, error } = useFetchAPI('/v1/auth/logout', {
      method: 'POST',
      body: {
        refreshToken: refreshToken.value,
      },
    });
    // ignore errors on logout
    return { data, error };
  };

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    hasAccessToken,
    hasRefreshToken,
    setRefreshToken,
    setAccessToken,
    initial,
    setTokens,
    clearTokens,
    refresh,
    logout,
  };
}
