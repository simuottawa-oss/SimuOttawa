import { authIsConfigured, getMemberSession, isSeniorMember } from '../../../../lib/auth'

export const runtime = 'edge'

export async function GET(request: Request) {
  const configured = authIsConfigured()
  const session = await getMemberSession(request)

  return Response.json({
    configured,
    authenticated: Boolean(session),
    canUpload: session ? isSeniorMember(session.email) : false,
    user: session ? { email: session.email, name: session.name } : null,
  }, { headers: { 'Cache-Control': 'no-store' } })
}
