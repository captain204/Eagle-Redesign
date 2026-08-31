import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer 1STEAGLE_ADMIN_SECRET') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const verifiedEntries = db.prepare(`
            SELECT * FROM RaffleSubmissions WHERE status = 'Verified'
        `).all() as any[];

        if (verifiedEntries.length === 0) {
            return NextResponse.json({ success: false, message: 'No verified entries available for the draw.' });
        }

        const winnerIndex = Math.floor(Math.random() * verifiedEntries.length);
        const winner = verifiedEntries[winnerIndex];

        return NextResponse.json({ success: true, winner });
    } catch (error) {
        console.error('Error drawing winner:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
