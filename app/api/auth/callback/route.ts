import {
  clearTemporaryAuthCookies,
  createSessionToken,
  googleClientId,
  googleClientSecret,
  sessionCookie,
  temporaryAuthValues,
  verifyGoogleIdToken,
} from '../../../../lib/auth'

export const runtime = 'edge'

function documentationUrl(request: Request, result?: string) {
  const url = new URL(request.url)
  url.pathname = '/'
  url.search = ''
  url.hash = result ? `/documentation?auth=${result}` : '/documentation'
  return url
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const returnedState = url.searchParams.get('state')
  const oauthError = url.searchParams.get('error')
  const { state, nonce, codeVerifier } = temporaryAuthValues(request)

  if (oauthError || !code || !state || !nonce || !codeVerifier || returnedState !== state) {
    const headers = new Headers({ Location: documentationUrl(request, 'failed').toString(), 'Cache-Control': 'no-store' })
    for (const value of clearTemporaryAuthCookies(request)) headers.append('Set-Cookie', value)
    return new Response(null, { status: 302, headers })
  }

  try {
    const redirectUri = new URL('/api/auth/callback', request.url).toString()
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: googleClientId(),
        client_secret: googleClientSecret(),
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    })
    const tokens = await tokenResponse.json() as { id_token?: string }
    if (!tokenResponse.ok || !tokens.id_token) throw new Error('Google token exchange failed.')

    const member = await verifyGoogleIdToken(tokens.id_token, nonce)
    const token = await createSessionToken(member)
    const headers = new Headers({ Location: documentationUrl(request).toString(), 'Cache-Control': 'no-store' })
    headers.append('Set-Cookie', sessionCookie(request, token))
    for (const value of clearTemporaryAuthCookies(request)) headers.append('Set-Cookie', value)
    return new Response(null, { status: 302, headers })
  } catch {
    const headers = new Headers({ Location: documentationUrl(request, 'failed').toString(), 'Cache-Control': 'no-store' })
    for (const value of clearTemporaryAuthCookies(request)) headers.append('Set-Cookie', value)
    return new Response(null, { status: 302, headers })
  }
}
