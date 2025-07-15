let prodToken: string | null = null;
let prodExpiry = 0;

/**
 * Returns an OAuth access token for the specified environment. Sandbox tokens
 * are read directly from the environment variable. Production tokens are
 * automatically refreshed using the refresh token flow if client credentials
 * are provided.
 */
export async function getAccessToken(env: 'sandbox' | 'production'): Promise<string | undefined> {
  if (env === 'sandbox') {
    return process.env.EBAY_SANDBOX_OAUTH_TOKEN;
  }

  const now = Date.now();
  if (prodToken && now < prodExpiry) {
    return prodToken;
  }

  const clientId = process.env.EBAY_PROD_CLIENT_ID;
  const clientSecret = process.env.EBAY_PROD_CLIENT_SECRET;
  const refreshToken = process.env.EBAY_PROD_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return process.env.EBAY_OAUTH_TOKEN;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);
  // Using the basic browse scope
  params.append('scope', 'https://api.ebay.com/oauth/api_scope');

  const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Failed to refresh eBay token', { status: res.status, text });
    return process.env.EBAY_OAUTH_TOKEN;
  }

  const data = await res.json();
  prodToken = data.access_token;
  prodExpiry = now + data.expires_in * 1000 - 60 * 1000; // refresh a minute early
  return prodToken;
}
