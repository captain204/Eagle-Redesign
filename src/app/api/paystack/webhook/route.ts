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
            const metadata = event.data.metadata || {};
            const reference = event.data.reference;
            const customerEmail = event.data.customer?.email || '';
            const amountPaid = event.data.amount / 100; // Paystack returns amount in kobo

            // Check if an order already exists for this reference (idempotency guard)
            const existingOrders = await payload.find({
                collection: 'orders',
                where: {
                    notes: { contains: reference },
                },
                limit: 1,
                overrideAccess: true,
            });

            if (existingOrders.totalDocs > 0) {
                // Order already exists (e.g. verify route beat us to it)
                const existingOrder = existingOrders.docs[0];

                // Still ensure it's marked as paid
                if (existingOrder.paymentStatus !== 'paid') {
                    await payload.update({
                        collection: 'orders',
                        id: existingOrder.id,
                        data: {
                            paymentStatus: 'paid',
                            status: 'processing',
                        },
                        overrideAccess: true,
                    });
                    console.log(`Order ${existingOrder.id} updated to paid via webhook`);
                }

                // Send email if not already sent
                if (!existingOrder.emailSent) {
                    const populatedOrder = await payload.findByID({
                        collection: 'orders',
                        id: existingOrder.id,
                        depth: 1,
                        overrideAccess: true,
                    });

                    const email = (typeof populatedOrder.customer === 'object' && populatedOrder.customer !== null ? populatedOrder.customer.email : null) || populatedOrder.email;
                    if (email) {
                        const emailResult = await sendOrderConfirmationEmail(populatedOrder, email);
                        if (emailResult.success) {
                            await payload.update({
                                collection: 'orders',
                                id: existingOrder.id,
                                data: { emailSent: true },
                                overrideAccess: true,
                            });
                            console.log(`Order confirmation email sent for ${existingOrder.id} via webhook`);
                        }
                    }
                }

                return NextResponse.json({ status: 'ok' });
            }

            // Parse cart and shipping data from Paystack metadata
            let cartItems: { product: string; quantity: number; price: number }[] = [];
            let shippingData: { name?: string; street?: string; lga?: string; state?: string; country?: string } = {};

            try {
                if (metadata.cartData) {
                    cartItems = JSON.parse(metadata.cartData);
                }
            } catch (e) {
                console.error('Webhook: Failed to parse cartData from metadata:', e);
            }

            try {
                if (metadata.shippingData) {
                    shippingData = JSON.parse(metadata.shippingData);
                }
            } catch (e) {
                console.error('Webhook: Failed to parse shippingData from metadata:', e);
            }

            if (cartItems.length === 0) {
                console.error('Webhook: No cart items found in Paystack metadata for reference:', reference);
                return NextResponse.json({ status: 'ok', warning: 'No cart data to create order' });
            }

            // Create the order now that payment is confirmed
            const orderData: any = {
                email: customerEmail || 'unknown@customer.com',
                items: cartItems.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: amountPaid,
                status: 'processing',
                paymentStatus: 'paid',
                shippingAddress: {
                    name: shippingData.name || '',
                    street: shippingData.street || '',
                    lga: shippingData.lga || '',
                    state: shippingData.state || '',
                    country: shippingData.country || 'Nigeria',
                },
                notes: `Paid via Paystack (Webhook). Reference: ${reference}`,
                emailSent: false,
            };

            const newOrder = await payload.create({
                collection: 'orders',
                data: orderData,
                overrideAccess: true,
            });

            console.log(`Order ${newOrder.id} created via webhook. Reference: ${reference}`);

            // Send confirmation email
            if (orderData.email && orderData.email !== 'unknown@customer.com') {
                try {
                    const populatedOrder = await payload.findByID({
                        collection: 'orders',
                        id: newOrder.id,
                        depth: 1,
                        overrideAccess: true,
                    });

                    const emailResult = await sendOrderConfirmationEmail(populatedOrder, orderData.email);
                    if (emailResult.success) {
                        await payload.update({
                            collection: 'orders',
                            id: newOrder.id,
                            data: { emailSent: true },
                            overrideAccess: true,
                        });
                        console.log(`Order confirmation email sent for ${newOrder.id} via webhook`);
                    }
                } catch (emailError) {
                    console.error(`Webhook email error for order ${newOrder.id}:`, emailError);
                }
            }
        } catch (error) {
            console.error('Error processing Paystack webhook:', error);
            return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
        }
    }

    return NextResponse.json({ status: 'ok' });
}
