import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer 1STEAGLE_ADMIN_SECRET') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        db.prepare('UPDATE RaffleSubmissions SET status = ? WHERE id = ?').run(status, id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
