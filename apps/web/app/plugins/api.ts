export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: nuxtApp.$config.public.apiBase,
    onRequest({ options }) {
      // Include credentials for cross-origin requests
      options.credentials = 'include';

      // Ensure proper headers are set
      if (!options.headers) {
        options.headers = {};
      }

      // Set content type for JSON requests only if body is plain object or string
      if (
        options.method &&
        ['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase())
      ) {
        const body = options.body;
        const isJsonBody =
          body &&
          ((typeof body === 'object' &&
            !(body instanceof FormData) &&
            !(body instanceof Blob) &&
            !(body instanceof ArrayBuffer)) ||
            typeof body === 'string');
        if (isJsonBody) {
          options.headers['Content-Type'] = 'application/json';
        }
      }
    },
    onResponseError({ request, response }) {
      // Handle CORS errors specifically
      if (response.status === 0) {
        console.error('CORS error or network issue detected', {
          url: request?.url,
          method: request?.method,
          response,
        });
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
