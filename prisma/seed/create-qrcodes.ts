import { PrismaClient } from '@prisma/client';
import * as QRCode from 'qrcode';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating QR codes for existing guests...');

    // Get all guests without QR codes
    const guestsWithoutQRCodes = await prisma.guest.findMany({
        where: {
            qrCode: null
        }
    });

    console.log(`Found ${guestsWithoutQRCodes.length} guests without QR codes`);

    for (const guest of guestsWithoutQRCodes) {
        // Generate unique alphanumeric code
        const alphanumericCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        // Generate QR code data
        const qrCodeData = await QRCode.toDataURL(alphanumericCode);

        // Create QR code record
        await prisma.qrCode.create({
            data: {
                alphanumericCode,
                qrCodeData,
                guestId: guest.id,
                used: guest.checkedIn,
            }
        });

        console.log(`Created QR code for ${guest.firstName} ${guest.lastName}: ${alphanumericCode}`);
    }

    console.log('QR codes created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


