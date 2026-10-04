import { env } from 'cloudflare:workers'
import { requireSeniorMember } from '../../../lib/auth'

export const runtime = 'edge'

const MAX_FILE_SIZE = 15 * 1024 * 1024
const allowedTypes: Record<string, string> = {
  pdf: 'application/pdf',
  md: 'text/markdown; charset=utf-8',
  txt: 'text/plain; charset=utf-8',
  rst: 'text/plain; charset=utf-8',
  json: 'application/json; charset=utf-8',
  yaml: 'text/plain; charset=utf-8',
  yml: 'text/plain; charset=utf-8',
  xml: 'text/plain; charset=utf-8',
  csv: 'text/csv; charset=utf-8',
  log: 'text/plain; charset=utf-8',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export async function GET() {
  const result = await env.DB.prepare(`
    SELECT id, title, description, file_name AS fileName,
           content_type AS contentType, size, uploaded_at AS uploadedAt
    FROM documents
    ORDER BY uploaded_at DESC
  `).all()

  return Response.json({ documents: result.results }, {
    headers: { 'Cache-Control': 'public, max-age=30' },
  })
}

export async function POST(request: Request) {
  const authorization = await requireSeniorMember(request)
  if ('response' in authorization) return authorization.response

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_FILE_SIZE + 1_000_000) {
    return Response.json({ error: 'The file is larger than the 15 MB limit.' }, { status: 413 })
  }

  const form = await request.formData()
  const file = form.get('file')
  const rawTitle = String(form.get('title') || '').trim()
  const description = String(form.get('description') || '').trim().slice(0, 500)

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: 'Choose a document to upload.' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'The file is larger than the 15 MB limit.' }, { status: 413 })
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const contentType = allowedTypes[extension]
  if (!contentType) {
    return Response.json({ error: 'Unsupported format. Upload PDF, Markdown, text, data, or Word documents.' }, { status: 415 })
  }

  const id = crypto.randomUUID()
  const objectKey = `documents/${id}.${extension}`
  const title = (rawTitle || file.name.replace(/\.[^.]+$/, '')).slice(0, 160)
  const uploadedAt = new Date().toISOString()

  await env.FILES.put(objectKey, file.stream(), {
    httpMetadata: { contentType },
    customMetadata: { originalName: file.name.slice(0, 240) },
  })

  try {
    await env.DB.prepare(`
      INSERT INTO documents (id, title, description, file_name, object_key, content_type, size, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, title, description, file.name.slice(0, 240), objectKey, contentType, file.size, uploadedAt).run()
  } catch (error) {
    await env.FILES.delete(objectKey)
    throw error
  }

  return Response.json({
    document: { id, title, description, fileName: file.name, contentType, size: file.size, uploadedAt },
  }, { status: 201 })
}
