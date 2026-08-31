import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

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
                const doc = new PDFDocument({ margins: { top: 30, bottom: 30, left: 50, right: 50 } });
                const chunks: Buffer[] = [];
                
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));

                // Add Logo
                const logoPath = path.join(process.cwd(), 'public', 'images', '1steagle', 'logo.jpg');
                if (require('fs').existsSync(logoPath)) {
                    doc.image(logoPath, 250, 30, { width: 100 });
                }

                doc.fontSize(24).fillColor('#FF5F1F').text('1stEagle Technology', 0, 110, { align: 'center' });
                doc.fontSize(16).fillColor('#000000').text('Distributor Raffle Codes', { align: 'center' });
                
                // Instructions Block
                doc.rect(50, 160, 500, 60).fillAndStroke('#FFF5F2', '#FF5F1F');
                doc.fontSize(10).fillColor('#FF5F1F').text('INSTRUCTIONS FOR DISTRIBUTORS:', 60, 170, { font: 'Helvetica-Bold' });
                doc.fillColor('#333').text('Assign one code per purchase. Uploaded/used codes will not work.', 60, 185, { font: 'Helvetica' });
                doc.text('This is a monthly raffle draw and winners are picked at random.', 60, 200);

                doc.fontSize(12).fillColor('#000000').text(`Batch ID: ${batchId} | Distributor ID: ${distributorId}`, 50, 240, { align: 'center' });

                // Table Headers
                const startY = 270;
                doc.fontSize(12).font('Helvetica-Bold');
                doc.text('S/N', 130, startY);
                doc.text('Raffle Code', 180, startY);
                doc.text('S/N', 360, startY);
                doc.text('Raffle Code', 410, startY);
                
                doc.moveTo(120, startY + 15).lineTo(490, startY + 15).stroke();
                
                doc.font('Helvetica');

                codes.forEach((code, index) => {
                    const isLeftColumn = index < 25;
                    const xOffset = isLeftColumn ? 130 : 360;
                    const rowIndex = isLeftColumn ? index : index - 25;
                    const yOffset = startY + 25 + (rowIndex * 18);
                    
                    const serialNumber = (index + 1).toString().padStart(2, '0');
                    doc.fontSize(12).fillColor('#666666').text(`${serialNumber}.`, xOffset, yOffset);
                    doc.fontSize(14).fillColor('#000000').font('Helvetica-Bold').text(code, xOffset + 50, yOffset - 1);
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
