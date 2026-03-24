import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
    }

    try {
        const payload = await getPayload({ config });
        const result = await verifyPaystackTransaction(reference);

        if (result.status && result.data.status === 'success') {
            const orderId = result.data.metadata?.orderId;

            if (orderId) {
                // Get current order state to check if email was already sent
                const order = await payload.findByID({
                    collection: 'orders',
                    id: orderId,
                });

                // Update order status if not already paid
                if (order.paymentStatus !== 'paid') {
                    await payload.update({
                        collection: 'orders',
                        id: orderId,
                        data: {
                            paymentStatus: 'paid',
                            status: 'processing',
                            notes: `Paid via Paystack. Reference: ${reference}`
                        },
                    });
                }

                // Send email if not already sent
                if (!order.emailSent) {
                    const updatedOrder = await payload.findByID({
                        collection: 'orders',
                        id: orderId,
                        depth: 1, // Populate customer
                    });

                    const customerEmail = typeof updatedOrder.customer === 'object' ? updatedOrder.customer.email : null;

                    if (customerEmail) {
                        const emailResult = await sendOrderConfirmationEmail(updatedOrder, customerEmail);
                        if (emailResult.success) {
                            await payload.update({
                                collection: 'orders',
                                id: orderId,
                                data: {
                                    emailSent: true
                                },
                            });
                        }
                    }
                }
            }

            return NextResponse.json({ success: true, data: result.data });
        } else {
            return NextResponse.json({ success: false, message: result.message || 'Verification failed' });
        }
    } catch (error: any) {
        console.error('Paystack verification error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
