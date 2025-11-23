import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode'; // Correct the import statement
import { v4 as uuidv4 } from 'uuid';

        }
        try {
            const image = await QRCode.toDataURL(qrCodeData);
            return image;
        } catch (error) {
            this.logger.error('Failed to generate QR code image', error);
            throw error;
        }
    }

    private async generateAlphanumericCode(): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code: string;
        do {
            code = Array.from({ length: 8 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (await this.prisma.qrCode.findUnique({ where: { alphanumericCode: code } }));
        return code;
    }

    async verifyCode(code: string) {
        const qrCode = await this.prisma.qrCode.findUnique({
            where: { alphanumericCode: code },
            include: { guest: true }
        });

        if (!qrCode) {
            throw new NotFoundException('Invalid code');
        }

        return qrCode;
    }

    async logScan(params: { guestId?: string; qrCodeId?: string; method: 'SCAN' | 'MANUAL'; success: boolean; reason?: string; }) {
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

    async checkInGuest(code: string) {
        const qrCode = await this.verifyCode(code);

        if (qrCode.used) {
            // log duplicate attempt
            await this.logScan({ guestId: qrCode.guestId, qrCodeId: qrCode.id, method: 'MANUAL', success: false, reason: 'Code already used' });
            throw new Error('Code already used');
        }

        // Update both QR code and guest in a transaction
        const updatedQrCode = await this.prisma.$transaction(async (prisma) => {
            // Update QR code as used
            const updated = await prisma.qrCode.update({
                where: { id: qrCode.id },
                data: { used: true },
                include: { guest: true }
            });

            // Update guest as checked in with timestamp
            await prisma.guest.update({
                where: { id: qrCode.guestId },
                data: { checkedIn: true, checkedInAt: new Date() }
            });

            return updated;
        });

        // log successful check-in (manual by default)
        await this.logScan({ guestId: updatedQrCode.guestId, qrCodeId: updatedQrCode.id, method: 'MANUAL', success: true });

        return updatedQrCode;
    }

    async findByGuestId(guestId: string) {
        return await this.prisma.qrCode.findUnique({
            where: { guestId },
            include: { guest: true }
        });
    }
}