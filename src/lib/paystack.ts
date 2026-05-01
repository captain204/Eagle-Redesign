const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function verifyPaystackTransaction(reference: string) {
    if (!PAYSTACK_SECRET_KEY) {
        console.error('[Paystack] PAYSTACK_SECRET_KEY is missing from environment variables');
        throw new Error("PAYSTACK_SECRET_KEY is not defined in environment variables");
    }

    console.log('[Paystack] Verifying transaction:', { 
        reference, 
        hasSecretKey: !!PAYSTACK_SECRET_KEY,
        secretKeyPrefix: PAYSTACK_SECRET_KEY.substring(0, 7)
    });

    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY.trim()}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Paystack] Verification API error:', {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            return { status: false, message: `Paystack API error: ${response.status}` };
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('[Paystack] Fetch error during verification:', error);
        throw new Error(`Failed to verify transaction: ${error.message}`);
    }
}
