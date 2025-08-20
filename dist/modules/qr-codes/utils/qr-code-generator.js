"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCode = generateQRCode;
const QRCode = require("qrcode");
const uuid_1 = require("uuid");
async function generateQRCode() {
    const uniqueId = (0, uuid_1.v4)();
    const qrCodeDataUrl = await QRCode.toDataURL(uniqueId, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300,
    });
    return qrCodeDataUrl;
}
//# sourceMappingURL=qr-code-generator.js.map