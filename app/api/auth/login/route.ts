import {
  authIsConfigured,
  googleClientId,
  temporaryAuthCookies,
} from '../../../../lib/auth'

export const runtime = 'edge'

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function base64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export async function GET(request: Request) {
  if (!authIsConfigured()) {
    return new Response('Senior-member sign-in is not configured yet.', { status: 503 })
  }

  const state = randomToken()
  const nonce = randomToken()
  const codeVerifier = randomToken() + randomToken()
  const challenge = base64Url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))))
  const redirectUri = new URL('/api/auth/callback', request.url).toString()
  const authorizeUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authorizeUrl.search = new URLSearchParams({
    client_id: googleClientId(),
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'openid profile email',
    state,
    nonce,
    prompt: 'select_account',
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString()

  const headers = new Headers({ Location: authorizeUrl.toString(), 'Cache-Control': 'no-store' })
  for (const value of temporaryAuthCookies(request, state, nonce, codeVerifier)) headers.append('Set-Cookie', value)
  return new Response(null, { status: 302, headers })
}
