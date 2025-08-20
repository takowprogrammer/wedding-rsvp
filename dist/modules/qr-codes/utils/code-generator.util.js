"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenerator = void 0;
class CodeGenerator {
    static generateAlphanumericCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }
    static generateQrCodeData(guestId, alphanumericCode) {
        return JSON.stringify({
            guestId,
            code: alphanumericCode,
            timestamp: Date.now(),
            type: 'wedding-rsvp'
        });
    }
}
exports.CodeGenerator = CodeGenerator;
//# sourceMappingURL=code-generator.util.js.map