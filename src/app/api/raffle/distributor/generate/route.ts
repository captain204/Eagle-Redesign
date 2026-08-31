import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';

const generateCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pin, distributorId } = body;

        // Simple auth for distributor (ideally would look up in Payload DB or a hardcoded list)
        if (pin !== 'EAGLE2026') {
            return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
        }

        const batchId = crypto.randomUUID();
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        const codes: string[] = [];

        // Check limit
        const limitCheck = db.prepare(`
            SELECT COUNT(*) as count FROM RaffleCodes WHERE generatedBy = ? AND month = ?
        `).get(`distributor_${distributorId}`, month) as { count: number };

        if (limitCheck.count + 50 > 200) {
            return NextResponse.json({ error: 'Monthly code limit (200) exceeded.' }, { status: 403 });
        }

        const insert = db.prepare(`
            INSERT INTO RaffleCodes (code, batchId, generatedBy, month)
            VALUES (?, ?, ?, ?)
        `);

        db.transaction(() => {
            for (let i = 0; i < 50; i++) {
                let newCode = generateCode();
                let isUnique = false;
                
                while(!isUnique) {
                    try {
                        insert.run(newCode, batchId, `distributor_${distributorId}`, month);
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
                doc.fontSize(18).fillColor('#000000').text('Distributor Raffle Codes', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12).text(`Batch ID: ${batchId} | Distributor ID: ${distributorId}`, { align: 'center' });
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

        // We return base64 string because we are receiving json on the client side (fetch with body)
        // Returning binary from fetch inside frontend is tricky if it's a POST with json body.
        return NextResponse.json({
            success: true,
            pdfBase64: pdfBuffer.toString('base64'),
            filename: `Distributor_${distributorId}_Raffle_Codes_${batchId}.pdf`
        });

    } catch (error) {
        console.error('Error generating distributor codes:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
