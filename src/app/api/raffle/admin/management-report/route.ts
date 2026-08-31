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
                const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
                const chunks: Buffer[] = [];
                
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                doc.fontSize(24).fillColor('#FF5F1F').text('1stEagle Technology', { align: 'center' });
                doc.fontSize(16).fillColor('#000000').text('Management Raffle Report', { align: 'center' });
                doc.moveDown(2);

                // Table Header
                doc.fontSize(10).font('Helvetica-Bold');
                const startY = doc.y;
                doc.text('Date', 30, startY);
                doc.text('Name', 100, startY);
                doc.text('Phone', 220, startY);
                doc.text('Location', 310, startY);
                doc.text('Product', 440, startY);
                doc.text('Code', 620, startY);
                doc.text('Status', 720, startY);
                doc.moveTo(30, startY + 15).lineTo(780, startY + 15).stroke();
                
                doc.font('Helvetica');
                let currentY = startY + 25;

                submissions.forEach((sub, index) => {
                    if (currentY > 550) { // Landscape height is approx 595
                        doc.addPage();
                        currentY = 50;
                    }

                    const date = new Date(sub.createdAt).toLocaleDateString();
                    const name = sub.firstName && sub.lastName ? `${sub.firstName} ${sub.lastName}` : (sub.userEmail || 'N/A');
                    const location = sub.location && sub.state ? `${sub.location}, ${sub.state}` : (sub.exifLatitude ? `${sub.exifLatitude.toFixed(2)}, ${sub.exifLongitude.toFixed(2)}` : 'N/A');
                    const product = sub.product || 'N/A';
                    const code = sub.raffleCode || 'N/A';

                    doc.text(date, 30, currentY);
                    doc.text(name, 100, currentY, { width: 110, ellipsis: true });
                    doc.text(sub.userPhone || 'N/A', 220, currentY);
                    doc.text(location, 310, currentY, { width: 120, ellipsis: true });
                    doc.text(product, 440, currentY, { width: 170, ellipsis: true });
                    doc.text(code, 620, currentY, { width: 90, ellipsis: true });
                    
                    doc.fillColor(sub.status === 'Verified' ? 'green' : 'red');
                    doc.text(sub.status, 720, currentY);
                    
                    doc.fillColor('black');

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
