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
var QrCodesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const QRCode = require("qrcode");
const uuid_1 = require("uuid");
let QrCodesService = QrCodesService_1 = class QrCodesService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(QrCodesService_1.name);
    }
    async generateQrCode(guestId) {
        this.logger.log(`Generating QR code for guest: ${guestId}`);
        const alphanumericCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        this.logger.log(`Generated alphanumeric code: ${alphanumericCode}`);
        const qrCodeData = alphanumericCode;
        this.logger.debug(`QR code data: ${qrCodeData}`);
        const qrCode = await this.prisma.qrCode.create({
            data: {
                id: (0, uuid_1.v4)(),
                guestId,
                alphanumericCode,
                qrCodeData,
                used: false,
            },
        });
        this.logger.log(`QR code saved to database with ID: ${qrCode.id}`);
        return qrCode;
    }
    async generateQrCodeImage(qrCodeData) {
        if (!qrCodeData) {
            this.logger.error('generateQrCodeImage called with no data');
            throw new Error('QR code data cannot be empty.');
        }
        try {
            const image = await QRCode.toDataURL(qrCodeData);
            return image;
        }
        catch (error) {
            this.logger.error('Failed to generate QR code image', error);
            throw error;
        }
    }
    async generateAlphanumericCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code;
        do {
            code = Array.from({ length: 8 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (await this.prisma.qrCode.findUnique({ where: { alphanumericCode: code } }));
        return code;
    }
    async verifyCode(code) {
        const qrCode = await this.prisma.qrCode.findUnique({
            where: { alphanumericCode: code },
            include: { guest: true }
        });
        if (!qrCode) {
            throw new common_1.NotFoundException('Invalid code');
        }
        return qrCode;
    }
    async logScan(params) {
        await this.prisma.scanLog.create({
            data: {
                guestId: params.guestId,
                qrCodeId: params.qrCodeId,
                method: params.method,
                success: params.success,
                reason: params.reason,
            }
        });
    }
    async checkInGuest(code) {
        const qrCode = await this.verifyCode(code);
        if (qrCode.used) {
            await this.logScan({ guestId: qrCode.guestId, qrCodeId: qrCode.id, method: 'MANUAL', success: false, reason: 'Code already used' });
            throw new Error('Code already used');
        }
        const updatedQrCode = await this.prisma.$transaction(async (prisma) => {
            const updated = await prisma.qrCode.update({
                where: { id: qrCode.id },
                data: { used: true },
                include: { guest: true }
            });
            await prisma.guest.update({
                where: { id: qrCode.guestId },
                data: { checkedIn: true, checkedInAt: new Date() }
            });
            return updated;
        });
        await this.logScan({ guestId: updatedQrCode.guestId, qrCodeId: updatedQrCode.id, method: 'MANUAL', success: true });
        return updatedQrCode;
    }
    async findByGuestId(guestId) {
        return await this.prisma.qrCode.findUnique({
            where: { guestId },
            include: { guest: true }
        });
    }
};
exports.QrCodesService = QrCodesService;
exports.QrCodesService = QrCodesService = QrCodesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrCodesService);
//# sourceMappingURL=qr-codes.service.js.map