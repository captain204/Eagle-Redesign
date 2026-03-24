export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { sendOrderConfirmationEmail } from '@/lib/email';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: NextRequest) {
    if (!PAYSTACK_SECRET_KEY) {
        return NextResponse.json({ error: 'PAYSTACK_SECRET_KEY is not defined' }, { status: 500 });
    }

    const payloadText = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify signature
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(payloadText).digest('hex');
    if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(payloadText);

    if (event.event === 'charge.success') {
        try {
            const payload = await getPayload({ config });
            const orderId = event.data.metadata?.orderId;
            const reference = event.data.reference;

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
                            notes: `Paid via Paystack (Webhook). Reference: ${reference}`
                        },
                    });
                    console.log(`Order ${orderId} updated via Paystack webhook`);
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
                            console.log(`Order confirmation email sent for ${orderId}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error processing Paystack webhook:', error);
            return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
        }
    }

    return NextResponse.json({ status: 'ok' });
}
