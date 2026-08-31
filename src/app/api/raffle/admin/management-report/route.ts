import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';
import PDFDocument from 'pdfkit';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer 1STEAGLE_ADMIN_SECRET') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const submissions = db.prepare(`
            SELECT * FROM RaffleSubmissions ORDER BY createdAt DESC
        `).all() as any[];

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50, size: 'A4' });
                const chunks: Buffer[] = [];
                
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                doc.fontSize(24).fillColor('#FF5F1F').text('1stEagle Technology', { align: 'center' });
                doc.fontSize(16).fillColor('#000000').text('Management Raffle Report', { align: 'center' });
                doc.moveDown(2);

                // Table Header
                doc.fontSize(10).font('Helvetica-Bold');
                const startY = doc.y;
                doc.text('Date', 50, startY);
                doc.text('Email', 150, startY);
                doc.text('Phone', 300, startY);
                doc.text('Status', 400, startY);
                doc.text('Location', 480, startY);
                doc.moveTo(50, startY + 15).lineTo(550, startY + 15).stroke();
                
                doc.font('Helvetica');
                let currentY = startY + 25;

                submissions.forEach((sub, index) => {
                    if (currentY > 750) {
                        doc.addPage();
                        currentY = 50;
                    }

                    const date = new Date(sub.createdAt).toLocaleDateString();
                    const location = sub.exifLatitude && sub.exifLongitude 
                        ? `${sub.exifLatitude.toFixed(2)}, ${sub.exifLongitude.toFixed(2)}` 
                        : (sub.status === 'Verified' && !sub.distance ? 'Online Purchase' : 'No GPS Data');

                    doc.text(date, 50, currentY);
                    doc.text(sub.userEmail || 'N/A', 150, currentY, { width: 140, ellipsis: true });
                    doc.text(sub.userPhone || 'N/A', 300, currentY);
                    
                    doc.fillColor(sub.status === 'Verified' ? 'green' : 'red');
                    doc.text(sub.status, 400, currentY);
                    
                    doc.fillColor('black');
                    doc.text(location, 480, currentY, { width: 70, ellipsis: true });

                    currentY += 20;
                });

                doc.end();
            } catch (err) {
                reject(err);
            }
        });

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="1stEagle_Raffle_Report_${new Date().toISOString().split('T')[0]}.pdf"`,
            }
        });

    } catch (error) {
        console.error('Error generating management report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
