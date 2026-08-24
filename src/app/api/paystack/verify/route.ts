export const dynamic = 'force-dynamic'
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
            const metadata = result.data.metadata || {};
            const customerEmail = result.data.customer?.email || metadata.custom_fields?.find((f: any) => f.variable_name === 'customer_email')?.value || '';
            const amountPaid = result.data.amount / 100; // Paystack returns amount in kobo

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
                // Order already exists (e.g. webhook beat us to it)
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
                }

                return NextResponse.json({ success: true, data: result.data, orderId: existingOrder.id });
            }

            // Parse cart and shipping data from Paystack metadata
            let cartItems: { product: string; quantity: number; price: number }[] = [];
            let shippingData: { name?: string; street?: string; lga?: string; state?: string; country?: string } = {};

            try {
                if (metadata.cartData) {
                    cartItems = JSON.parse(metadata.cartData);
                }
            } catch (e) {
                console.error('Failed to parse cartData from metadata:', e);
            }

            try {
                if (metadata.shippingData) {
                    shippingData = JSON.parse(metadata.shippingData);
                }
            } catch (e) {
                console.error('Failed to parse shippingData from metadata:', e);
            }

            if (cartItems.length === 0) {
                console.error('No cart items found in Paystack metadata for reference:', reference);
                return NextResponse.json({
                    success: true,
                    data: result.data,
                    warning: 'Payment verified but no cart data found to create order. Contact support.',
                });
            }

            // Create the order now that payment is confirmed
            const orderData: any = {
                email: customerEmail || result.data.customer?.email || 'unknown@customer.com',
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
                notes: `Paid via Paystack. Reference: ${reference}`,
                emailSent: false,
                appliedReferralCode: metadata.referralCode || '',
            };

            const newOrder = await payload.create({
                collection: 'orders',
                data: orderData,
                overrideAccess: true,
            });

            console.log(`Order ${newOrder.id} created after payment verification. Reference: ${reference}`);

            // Send confirmation email
            if (orderData.email && orderData.email !== 'unknown@customer.com') {
                try {
                    // Fetch the order with populated relations for the email template
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
                        console.log(`Order confirmation email sent for order ${newOrder.id}`);
                    } else {
                        console.error(`Failed to send confirmation email for order ${newOrder.id}:`, emailResult.error);
                    }
                } catch (emailError) {
                    console.error(`Email sending error for order ${newOrder.id}:`, emailError);
                }
            }

            return NextResponse.json({ success: true, data: result.data, orderId: newOrder.id });
        } else {
            return NextResponse.json({ success: false, message: result.message || 'Verification failed' });
        }
    } catch (error: any) {
        console.error('Paystack verification error:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
