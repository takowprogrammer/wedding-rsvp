"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesController = void 0;
const common_1 = require("@nestjs/common");
const qr_codes_service_1 = require("./qr-codes.service");
let QrCodesController = class QrCodesController {
    constructor(qrCodesService) {
        this.qrCodesService = qrCodesService;
    }
    async verifyCode(code) {
        try {
            const qrCode = await this.qrCodesService.verifyCode(code);
            await this.qrCodesService.logScan({ guestId: qrCode.guestId, qrCodeId: qrCode.id, method: 'MANUAL', success: true });
            return {
                valid: true,
                guest: qrCode.guest,
                used: qrCode.used
            };
        }
        catch (error) {
            await this.qrCodesService.logScan({ method: 'MANUAL', success: false, reason: 'Invalid code' });
            throw new common_1.HttpException({ valid: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async checkInGuest(code) {
        try {
            const qrCode = await this.qrCodesService.checkInGuest(code);
            return {
                success: true,
                guest: qrCode.guest,
                message: 'Guest checked in successfully'
            };
        }
        catch (error) {
            throw new common_1.HttpException({ success: false, message: error.message }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getQrCodeByGuest(guestId) {
        const qrCode = await this.qrCodesService.findByGuestId(guestId);
        if (!qrCode) {
            throw new common_1.HttpException('QR code not found', common_1.HttpStatus.NOT_FOUND);
        }
        const qrCodeImage = await this.qrCodesService.generateQrCodeImage(qrCode.qrCodeData);
        return {
            alphanumericCode: qrCode.alphanumericCode,
            qrCodeImage,
            guest: qrCode.guest
        };
    }
};
exports.QrCodesController = QrCodesController;
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "verifyCode", null);
__decorate([
    (0, common_1.Post)('checkin'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "checkInGuest", null);
__decorate([
    (0, common_1.Get)('guest/:guestId'),
    __param(0, (0, common_1.Param)('guestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "getQrCodeByGuest", null);
exports.QrCodesController = QrCodesController = __decorate([
    (0, common_1.Controller)('qr-codes'),
    __metadata("design:paramtypes", [qr_codes_service_1.QrCodesService])
], QrCodesController);
//# sourceMappingURL=qr-codes.controller.js.map