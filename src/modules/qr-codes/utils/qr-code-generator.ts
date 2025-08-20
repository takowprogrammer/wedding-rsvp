import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export async function generateQRCode(): Promise<string> {
    const uniqueId = uuidv4();
    const qrCodeDataUrl = await QRCode.toDataURL(uniqueId, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
    });

    return qrCodeDataUrl;
} 