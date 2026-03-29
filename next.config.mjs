import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        memoryBasedWorkersCount: true,
    },
};

export default withPayload(nextConfig);
