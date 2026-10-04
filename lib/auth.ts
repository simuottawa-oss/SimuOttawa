import { env } from 'cloudflare:workers'
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose'

const SESSION_COOKIE = 'simuo_session'
const STATE_COOKIE = 'simuo_oauth_state'
const NONCE_COOKIE = 'simuo_oauth_nonce'
const CODE_VERIFIER_COOKIE = 'simuo_oauth_code_verifier'
const SESSION_ISSUER = 'simuottawa.ca'
const SESSION_AUDIENCE = 'simuottawa-senior-members'

type AuthEnvironment = Cloudflare.Env & {
  AUTH_SECRET?: string
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  SENIOR_MEMBER_EMAILS?: string
}

export type MemberSession = {
  sub: string
  email: string
  name: string
}

function authEnv() {
  return env as AuthEnvironment
}

export function authIsConfigured() {
  const bindings = authEnv()
  return Boolean(
    bindings.AUTH_SECRET && bindings.AUTH_SECRET.length >= 32
    && bindings.GOOGLE_CLIENT_ID
    && bindings.GOOGLE_CLIENT_SECRET,
  )
}

export function googleClientId() {
  return authEnv().GOOGLE_CLIENT_ID?.trim() || ''
}

export function googleClientSecret() {
  return authEnv().GOOGLE_CLIENT_SECRET || ''
}

export function seniorMemberEmails() {
  return new Set(
    (authEnv().SENIOR_MEMBER_EMAILS || '')
      .split(/[;,\n]/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  )
}

export function isSeniorMember(email: string) {
  return seniorMemberEmails().has(email.trim().toLowerCase())
}

function parseCookies(request: Request) {
  return new Map(
    (request.headers.get('cookie') || '')
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const separator = entry.indexOf('=')
        return separator === -1
          ? [entry, '']
          : [entry.slice(0, separator), decodeURIComponent(entry.slice(separator + 1))]
      }),
  )
}

function cookie(name: string, value: string, request: Request, maxAge: number) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

export function temporaryAuthCookies(request: Request, state: string, nonce: string, codeVerifier: string) {
  return [
    cookie(STATE_COOKIE, state, request, 600),
    cookie(NONCE_COOKIE, nonce, request, 600),
    cookie(CODE_VERIFIER_COOKIE, codeVerifier, request, 600),
  ]
}

export function clearTemporaryAuthCookies(request: Request) {
  return [
    cookie(STATE_COOKIE, '', request, 0),
    cookie(NONCE_COOKIE, '', request, 0),
    cookie(CODE_VERIFIER_COOKIE, '', request, 0),
  ]
}

export function temporaryAuthValues(request: Request) {
  const cookies = parseCookies(request)
  return {
    state: cookies.get(STATE_COOKIE),
    nonce: cookies.get(NONCE_COOKIE),
    codeVerifier: cookies.get(CODE_VERIFIER_COOKIE),
  }
}

function sessionSecret() {
  const secret = authEnv().AUTH_SECRET
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters.')
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(session: MemberSession) {
  return new SignJWT({ email: session.email, name: session.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(session.sub)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(sessionSecret())
}

export function sessionCookie(request: Request, token: string) {
  return cookie(SESSION_COOKIE, token, request, 8 * 60 * 60)
}

export function clearSessionCookie(request: Request) {
  return cookie(SESSION_COOKIE, '', request, 0)
}

export async function getMemberSession(request: Request): Promise<MemberSession | null> {
  if (!authIsConfigured()) return null
  const token = parseCookies(request).get(SESSION_COOKIE)
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, sessionSecret(), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    })
    if (!payload.sub || typeof payload.email !== 'string') return null
    return {
      sub: payload.sub,
      email: payload.email.toLowerCase(),
      name: typeof payload.name === 'string' ? payload.name : payload.email,
    }
  } catch {
    return null
  }
}

export async function verifyGoogleIdToken(idToken: string, expectedNonce: string): Promise<MemberSession> {
  const jwks = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))
  const { payload } = await jwtVerify(idToken, jwks, {
    audience: googleClientId(),
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
  })

  if (payload.nonce !== expectedNonce) throw new Error('The sign-in response could not be verified.')

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  if (payload.email_verified !== true) throw new Error('Google did not confirm this email address.')
  if (!email) throw new Error('Google did not return an email address for this account.')
  if (!payload.sub) throw new Error('Google did not return a valid account identifier.')

  return {
    sub: `google:${payload.sub}`,
    email,
    name: typeof payload.name === 'string' ? payload.name : email,
  }
}

export async function requireSeniorMember(request: Request) {
  if (!authIsConfigured()) {
    return { response: Response.json({ error: 'Senior-member sign-in is not configured yet.' }, { status: 503 }) }
  }

  const session = await getMemberSession(request)
  if (!session) {
    return { response: Response.json({ error: 'Sign in with your authorized uOttawa account to upload documents.' }, { status: 401 }) }
  }
  if (!isSeniorMember(session.email)) {
    return { response: Response.json({ error: 'This uOttawa account does not have document upload access.' }, { status: 403 }) }
  }

  return { session }
}
