import { randomBytes } from 'crypto';

export class CodeGenerator {
    /**
     * Generates a unique 8-character alphanumeric code
     */
    static generateAlphanumericCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        
        return result;
    }

    /**
     * Generates QR code data string containing guest information
     */
    static generateQrCodeData(guestId: string, alphanumericCode: string): string {
        return JSON.stringify({
            guestId,
            code: alphanumericCode,
            timestamp: Date.now(),
            type: 'wedding-rsvp'
        });
    }
}