import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123_fallback');

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_DEFAULT_FROM || 'onboarding@resend.dev',
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
