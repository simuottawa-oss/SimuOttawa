import { clearSessionCookie } from '../../../../lib/auth'

export const runtime = 'edge'

export async function GET(request: Request) {
  const url = new URL(request.url)
  url.pathname = '/'
  url.search = ''
  url.hash = '/documentation'

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      'Set-Cookie': clearSessionCookie(request),
      'Cache-Control': 'no-store',
    },
  })
}
