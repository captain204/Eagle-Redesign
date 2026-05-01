import { verifyPaystackTransaction } from '../src/lib/paystack'

async function checkEnv() {
    console.log('--- Environment Check ---');
    console.log('NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? 
        `${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.substring(0, 7)}... (Length: ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.length})` : 
        'MISSING');
    
    console.log('PAYSTACK_SECRET_KEY:', process.env.PAYSTACK_SECRET_KEY ? 
        `${process.env.PAYSTACK_SECRET_KEY.substring(0, 7)}... (Length: ${process.env.PAYSTACK_SECRET_KEY.length})` : 
        'MISSING');
    
    console.log('NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL || 'MISSING');
}

checkEnv();
