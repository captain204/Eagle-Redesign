export const dynamic = 'force-dynamic'
import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST, REST_PUT } from '@payloadcms/next/routes'
import config from '@payload-config'

// Next.js 16 + Payload CMS route handlers
// Using type assertions to resolve Turbopack type conflicts
export const GET = REST_GET(config) as any
export const POST = REST_POST(config) as any
export const DELETE = REST_DELETE(config) as any
export const PATCH = REST_PATCH(config) as any
export const PUT = REST_PUT(config) as any
export const OPTIONS = REST_OPTIONS(config) as any
