export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const backendUrl = config.apiBaseServer || 'http://localhost:8000';

  // Extract the path after /api/auth
  const path = event.node.req.url?.replace(/^\/api\/auth/, '') || '';
  const targetUrl = `${backendUrl}/v1/auth${path}`;

  // Forward all headers including cookies
  const headers: HeadersInit = {};
  Object.entries(event.node.req.headers).forEach(([key, value]) => {
    if (value) {
      headers[key] = Array.isArray(value) ? value.join(', ') : value;
    }
  });

  // Debug logging
  console.log(`[AUTH PROXY] ${event.node.req.method} ${targetUrl}`);
  if (event.node.req.headers.cookie) {
    console.log(`[AUTH PROXY] Cookie header: ${event.node.req.headers.cookie}`);
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.node.req.method,
      headers,
      body:
        event.node.req.method !== 'GET' && event.node.req.method !== 'HEAD'
          ? await readBody(event)
          : undefined,
    });

    // Debug response
    console.log(`[AUTH PROXY] Response status: ${response.status}`);
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      console.log(`[AUTH PROXY] Set-Cookie response: ${setCookieHeader}`);
    }

    // Forward all response headers including Set-Cookie
    response.headers.forEach((value, key) => {
      setHeader(event, key, value);
    });

    // Set the status code
    setResponseStatus(event, response.status);

    // Return the response body
    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json();
    }

    return response.text();
  } catch (error) {
    console.error('[AUTH PROXY] Proxy error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Proxy error',
    });
  }
});
