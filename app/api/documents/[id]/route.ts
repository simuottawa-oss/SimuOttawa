import { env } from 'cloudflare:workers'
import { requireSeniorMember } from '../../../../lib/auth'

export const runtime = 'edge'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const document = await env.DB.prepare(`
    SELECT file_name AS fileName, object_key AS objectKey, content_type AS contentType
    FROM documents
    WHERE id = ?
  `).bind(id).first<{ fileName: string; objectKey: string; contentType: string }>()

  if (!document) return new Response('Document not found', { status: 404 })

  const object = await env.FILES.get(document.objectKey)
  if (!object) return new Response('Document file not found', { status: 404 })

  const safeName = document.fileName.replace(/["\\\r\n]/g, '_')
  const inline = document.contentType.startsWith('text/') || document.contentType.startsWith('application/json') || document.contentType === 'application/pdf'
  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Content-Type', document.contentType)
  headers.set('Content-Length', String(object.size))
  headers.set('Content-Disposition', `${inline ? 'inline' : 'attachment'}; filename="${safeName}"`)
  headers.set('Cache-Control', 'public, max-age=3600')
  headers.set('X-Content-Type-Options', 'nosniff')

  return new Response(object.body, { headers })
}

export async function DELETE(request: Request, context: RouteContext) {
  const authorization = await requireSeniorMember(request)
  if ('response' in authorization) return authorization.response

  const { id } = await context.params
  const document = await env.DB.prepare(`
    SELECT object_key AS objectKey FROM documents WHERE id = ?
  `).bind(id).first<{ objectKey: string }>()

  if (!document) return Response.json({ error: 'Document not found.' }, { status: 404 })

  // Delete the blob first so a storage failure never leaves a public listing
  // that points at a file that could not be removed. Retrying can clean up the
  // metadata if the database operation fails after this succeeds.
  await env.FILES.delete(document.objectKey)
  const result = await env.DB.prepare(`
    DELETE FROM documents WHERE id = ? AND object_key = ?
  `).bind(id, document.objectKey).run()

  if (!result.meta.changes) {
    return Response.json({ error: 'The document changed before it could be removed. Refresh and try again.' }, { status: 409 })
  }

  return Response.json({ deleted: true, id })
}
