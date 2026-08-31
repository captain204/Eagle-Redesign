import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';

const generateCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export async function POST(req: Request) {
    try {
        // Simple security check (replace with better auth in prod)
        const authHeader = req.headers.get('authorization');
        if (authHeader !== 'Bearer 1STEAGLE_ADMIN_SECRET') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const batchId = crypto.randomUUID();
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        const codes: string[] = [];

        // Insert codes into database
        const insert = db.prepare(`
            INSERT INTO RaffleCodes (code, batchId, generatedBy, month)
            VALUES (?, ?, 'Admin', ?)
        `);

        db.transaction(() => {
            for (let i = 0; i < 50; i++) {
                let newCode = generateCode();
                let isUnique = false;
                
                // Ensure unique code
                while(!isUnique) {
                    try {
                        insert.run(newCode, batchId, month);
                        isUnique = true;
                    } catch (err: any) {
                        if (err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
                            newCode = generateCode();
                        } else {
                            throw err;
                        }
                    }
                }
                codes.push(newCode);
            }
        })();

        // Generate PDF
        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            try {
                const doc = new PDFDocument();
                const chunks: Buffer[] = [];
                
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                doc.fontSize(24).fillColor('#FF5F1F').text('1stEagle Technology', { align: 'center' });
                doc.fontSize(18).fillColor('#000000').text('Official Raffle Draw Codes', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text(`Batch ID: ${batchId}`, { align: 'center' });
                doc.moveDown(2);

                let xOffset = 50;
                let yOffset = doc.y;

                codes.forEach((code, index) => {
                    if (index > 0 && index % 10 === 0) {
                        xOffset = 50;
                        yOffset += 40;
                    }
                    if (yOffset > 700) {
                        doc.addPage();
                        yOffset = 50;
                    }
                    doc.text(code, xOffset, yOffset);
                    xOffset += 80;
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
                'Content-Disposition': `attachment; filename="1stEagle_Raffle_Codes_${batchId}.pdf"`,
            }
        });

    } catch (error) {
        console.error('Error generating admin codes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
