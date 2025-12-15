import {
  decodeJWT,
  ErrorCode,
  type AccessTokenPayload,
  type ApiErrorResponse,
  type ValidationErrorResponse,
} from '@asetflow/shared';
import type {
  AccessTokenResponse,
  PayloadTokenResponse,
  SimpleUser,
} from '@asetflow/shared-types';
import type { FetchError } from 'ofetch';
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

  const user = useState<SimpleUser | null>('auth_user', () => null);
  const isAuthenticated = computed(
    () => !!accessToken.value && !!refreshToken.value
  );
  const hasRefreshToken = computed(() => !!refreshToken.value);
  const hasAccessToken = computed(() => !!accessToken.value);

  const setAccessToken = (token: string | null) => {
    accessToken.value = token;

    // update user information based payload in the token
    if (!token) {
      user.value = null;
      return;
    }

    const payload = decodeJWT(token) as AccessTokenPayload;

    // for now use simple user info from token payload
    user.value = {
      id: payload.sub!,
      email: payload.email,
      role: payload.role,
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
    const { data, error } = await useFetchAPI<AccessTokenResponse>(
      '/v1/auth/refresh',
      {
        method: 'POST',
        body: {
          refreshToken: refreshToken.value,
        },
      }
    );

    if (error.value) {
      const { response: resErr } = error.value as FetchError<
        ApiErrorResponse | ValidationErrorResponse
      >;
      console.error('Failed to refresh token:', error.value);
      // expired token and unauthorized are handled by logging out the user
      if (
        resErr?._data?.errorCode === ErrorCode.TOKEN_EXPIRED ||
        resErr?._data?.errorCode === ErrorCode.UNAUTHORIZED
      ) {
        setAccessToken(null);
        setRefreshToken(null);
      }
      throw error.value;
    }

    if (data.value?.accessToken) {
      setAccessToken(data.value.accessToken);
    }
    return data.value;
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
  };
}
