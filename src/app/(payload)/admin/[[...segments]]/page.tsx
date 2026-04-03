import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
    params: Promise<{
        segments: string[]
    }>
    searchParams: Promise<{
        [key: string]: string | string[]
    }>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
    const { segments = [] } = await params
    return generatePageMetadata({ config, params: { ...(await params), segments } as any, searchParams: (await searchParams) as any })
}

const Page = async ({ params, searchParams }: Args) => {
    const { segments = [] } = await params
    return RootPage({ config, importMap, params: { ...(await params), segments } as any, searchParams: (await searchParams) as any })
}

export default Page
