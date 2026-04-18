import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET() {
    try {
        const payload = await getPayload({ config });
        const products = await payload.find({ collection: 'products', limit: 1 });
        const prodId = products.docs[0]?.id || 1;

        const result = await payload.create({
            collection: 'orders',
            data: {
                email: "test@test.com",
                items: [{ product: prodId, quantity: 1, price: 100 }],
                total: 100,
                status: "pending",
                paymentStatus: "unpaid",
                shippingAddress: {
                    name: "Test",
                    street: "123 St",
                    lga: "LGA",
                    state: "Abia",
                    country: "Nigeria"
                }
            } as any
        });
        return NextResponse.json({ success: true, result });
    } catch (e: any) {
        return NextResponse.json({
            success: false,
            errorName: e?.name,
            errorMessage: e?.message,
            stack: e?.stack,
            data: e?.data
        });
    }
}
