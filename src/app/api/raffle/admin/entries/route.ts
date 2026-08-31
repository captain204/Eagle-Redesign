import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer 1STEAGLE_ADMIN_SECRET') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const submissions = db.prepare(`
            SELECT * FROM RaffleSubmissions ORDER BY createdAt DESC
        `).all();

        const stats = {
            total: submissions.length,
            verified: submissions.filter((s: any) => s.status === 'Verified').length,
            flagged: submissions.filter((s: any) => s.status === 'Flagged').length,
        };

        return NextResponse.json({ success: true, submissions, stats });
    } catch (error) {
        console.error('Error fetching admin entries:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
