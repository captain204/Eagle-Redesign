import { NextResponse } from 'next/server';
import db from '@/lib/raffleDb';
import crypto from 'crypto';
import exifr from 'exifr';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Basic Haversine Formula for distance calculation (in kilometers)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('photo') as File;
        const code = formData.get('code') as string;
        const userEmail = formData.get('userEmail') as string;
        const userPhone = formData.get('userPhone') as string;

        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const state = formData.get('state') as string;
        const location = formData.get('location') as string;
        const product = formData.get('product') as string;

        if (!file || !code || !userEmail || !firstName || !lastName || !state || !location || !product) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify Code exists and is not used
        const codeRecord = db.prepare('SELECT * FROM RaffleCodes WHERE code = ?').get(code) as any;
        if (!codeRecord) {
            return NextResponse.json({ error: 'Invalid Code' }, { status: 400 });
        }
        if (codeRecord.isUsed === 1) {
            return NextResponse.json({ error: 'Code already used' }, { status: 400 });
        }

        // 2. Hash Image to check for duplicates
        const buffer = Buffer.from(await file.arrayBuffer());
        const hashSum = crypto.createHash('sha256');
        hashSum.update(buffer);
        const imageHash = hashSum.digest('hex');

        const existingSubmission = db.prepare('SELECT * FROM RaffleSubmissions WHERE imageHash = ?').get(imageHash);
        if (existingSubmission) {
            return NextResponse.json({ error: 'Image already submitted for verification' }, { status: 400 });
        }

        // 3. Extract EXIF Data
        let exifData: any = null;
        try {
            exifData = await exifr.parse(buffer, { gps: true, datetime: true });
        } catch (e) {
            console.warn('No valid EXIF found', e);
        }

        let status = 'Flagged';
        let distance = null;
        let imagePath = null;

        // 4. Verification Logic (Strict Rule: auto-verify if GPS present, flag if missing)
        if (exifData && exifData.latitude && exifData.longitude) {
            // Find closest distributor
            const distributors = db.prepare('SELECT * FROM RaffleDistributorLocations').all() as any[];
            let minDistance = Infinity;

            for (const dist of distributors) {
                const d = calculateDistance(exifData.latitude, exifData.longitude, dist.latitude, dist.longitude);
                if (d < minDistance) minDistance = d;
            }

            distance = minDistance;
            
            // Assume valid if within 50km of a known distributor (adjust as necessary)
            if (minDistance <= 50) {
                status = 'Verified';
            } else {
                status = 'Flagged'; // Flag if GPS exists but is incredibly far away from any distributor
            }
        } else {
            status = 'Flagged'; // No GPS data
        }

        // 4.5 If Flagged for manual review, compress and save the image heavily to save disk space
        if (status === 'Flagged') {
            const uploadDir = path.join(process.cwd(), 'public', 'raffle-uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            
            const fileName = `${Date.now()}_${imageHash.substring(0, 8)}.webp`;
            const filePath = path.join(uploadDir, fileName);
            
            // Compress heavily: max 800px width, convert to webp, 60% quality (usually ~50KB instead of 5MB)
            await sharp(buffer)
                .resize({ width: 800, withoutEnlargement: true })
                .webp({ quality: 60 })
                .toFile(filePath);
                
            imagePath = `/raffle-uploads/${fileName}`;
        }

        // 5. Save Submission (Zero-Impact on Payload)
        db.transaction(() => {
            db.prepare(`
                INSERT INTO RaffleSubmissions (userEmail, userPhone, imageHash, imagePath, exifLatitude, exifLongitude, distance, status, firstName, lastName, state, location, product, raffleCode)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                userEmail, 
                userPhone || null, 
                imageHash, 
                imagePath,
                exifData?.latitude || null, 
                exifData?.longitude || null, 
                distance, 
                status,
                firstName,
                lastName,
                state,
                location,
                product,
                code
            );

            // Mark code as used
            db.prepare('UPDATE RaffleCodes SET isUsed = 1 WHERE code = ?').run(code);
        })();

        return NextResponse.json({ 
            success: true, 
            status: status,
            message: status === 'Verified' ? 'Your entry has been automatically verified!' : 'Your entry is pending manual review.' 
        });

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
