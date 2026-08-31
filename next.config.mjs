import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['pdfkit'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default withPayload(nextConfig);
