import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123_fallback');

export async function sendOrderConfirmationEmail(order: any, customerEmail: string) {
    try {
        const orderId = order.id;
        const total = order.total;
        const items = order.items || [];

        const itemsList = Array.isArray(items) ? items.map((item: any) => {
            const productTitle = typeof item.product === 'object' ? item.product.title : 'Product';
            return `<li>${productTitle} x ${item.quantity} - ₦${item.price.toLocaleString()}</li>`;
        }).join('') : '<li>Items details unavailable</li>';

        const html = `
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Total:</strong> ₦${total.toLocaleString()}</p>
            <h3>Items:</h3>
            <ul>${itemsList}</ul>
            <p>We are processing your order and will notify you once it's shipped.</p>
        `;

        const { data, error } = await resend.emails.send({
            from: '1st𝓔agle <onboarding@resend.dev>', // Use a verified domain in production
            to: [customerEmail, 'nurudeenakindele8@gmail.com', 'mrdydx92@yahoo.com'],
            subject: `Order Confirmation - #${orderId}`,
            html: html,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error };
    }
}
