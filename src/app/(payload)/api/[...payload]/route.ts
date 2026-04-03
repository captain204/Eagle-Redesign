export const dynamic = 'force-dynamic'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'

// Next.js 16 + Payload CMS route handlers
export const GET = async (req: Request, { params }: { params: Promise<any> }) => {
    const p = await params
    return REST_GET(config)(req, { params: { ...p, payload: p.payload || [] } })
}
export const POST = async (req: Request, { params }: { params: Promise<any> }) => {
    const p = await params
    return REST_POST(config)(req, { params: { ...p, payload: p.payload || [] } })
}
export const DELETE = async (req: Request, { params }: { params: Promise<any> }) => {
    const p = await params
    return REST_DELETE(config)(req, { params: { ...p, payload: p.payload || [] } })
}
export const PATCH = async (req: Request, { params }: { params: Promise<any> }) => {
    const p = await params
    return REST_PATCH(config)(req, { params: { ...p, payload: p.payload || [] } })
}
export const PUT = async (req: Request, { params }: { params: Promise<any> }) => {
    const p = await params
    return REST_PUT(config)(req, { params: { ...p, payload: p.payload || [] } })
}
export const OPTIONS = async (req: Request, { params }: { params: Promise<any> }) => {
    const p = await params
    return REST_OPTIONS(config)(req, { params: { ...p, payload: p.payload || [] } })
}
