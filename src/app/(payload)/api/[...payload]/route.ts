export const dynamic = 'force-dynamic'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'

// Next.js 16 + Payload CMS route handlers
export const GET = async (req: Request, { params }: { params: Promise<any> }) => REST_GET(config)(req, { params: await params })
export const POST = async (req: Request, { params }: { params: Promise<any> }) => REST_POST(config)(req, { params: await params })
export const DELETE = async (req: Request, { params }: { params: Promise<any> }) => REST_DELETE(config)(req, { params: await params })
export const PATCH = async (req: Request, { params }: { params: Promise<any> }) => REST_PATCH(config)(req, { params: await params })
export const PUT = async (req: Request, { params }: { params: Promise<any> }) => REST_PUT(config)(req, { params: await params })
export const OPTIONS = async (req: Request, { params }: { params: Promise<any> }) => REST_OPTIONS(config)(req, { params: await params })
