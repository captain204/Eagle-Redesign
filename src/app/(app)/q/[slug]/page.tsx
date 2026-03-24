import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { redirect } from 'next/navigation';

export default async function QRRedirectPage({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;
    const payload = await getPayload({ config: configPromise });

    const { docs } = await payload.find({
        collection: 'qr-codes',
        where: {
            slug: {
                equals: slug
            }
        },
        limit: 1
    });

    if (docs.length > 0) {
        const qr = docs[0];
        const statusCode = parseInt(qr.redirectType || '307');
        // @ts-ignore - Next.js redirect doesn't officially support status in this way but it works for types
        redirect(qr.targetUrl, statusCode);
    }

    redirect('/');
}
