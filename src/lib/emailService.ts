import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123_fallback');

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: '1stEagle Portal <noreply@1steagle.com>', // Replace with verified domain if available
            to,
            subject,
            html,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email Service Error:', error);
        return { success: false, error };
    }
};
