const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function verifyPaystackTransaction(reference: string) {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error("PAYSTACK_SECRET_KEY is not defined in environment variables");
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}
