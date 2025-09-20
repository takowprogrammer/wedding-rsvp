import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { QrCodesService } from './qr-codes.service';

@Controller('qr-codes')
export class QrCodesController {
    constructor(private readonly qrCodesService: QrCodesService) { }

    @Post('verify')
    async verifyCode(@Body('code') code: string) {
        try {
            const qrCode = await this.qrCodesService.verifyCode(code);
            // log a verify attempt (success)
            await this.qrCodesService.logScan({ guestId: qrCode.guestId, qrCodeId: qrCode.id, method: 'MANUAL', success: true });
            return {
                valid: true,
                guest: qrCode.guest,
                used: qrCode.used
            };
        } catch (error) {
            // log a failed verify (no qr code found)
            await this.qrCodesService.logScan({ method: 'MANUAL', success: false, reason: 'Invalid code' });
            throw new HttpException(
                { valid: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Post('checkin')
    async checkInGuest(@Body('code') code: string) {
        try {
            const qrCode = await this.qrCodesService.checkInGuest(code);
            return {
                success: true,
                guest: qrCode.guest,
                message: 'Guest checked in successfully'
            };
        } catch (error) {
            throw new HttpException(
                { success: false, message: (error as Error).message },
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @Get('guest/:guestId/image')
    async getQrImageByGuest(
        @Param('guestId') guestId: string,
        @Res() res: Response,
    ) {
        try {
            const qrCode = await this.qrCodesService.findByGuestId(guestId);
            if (!qrCode) {
                throw new HttpException('QR code not found', HttpStatus.NOT_FOUND);
            }

            const dataUrl = await this.qrCodesService.generateQrCodeImage(qrCode.qrCodeData);
            const base64 = dataUrl.split(',')[1] || '';
            const buffer = Buffer.from(base64, 'base64');

            res.setHeader('Content-Type', 'image/png');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.send(buffer);
        } catch (error) {
            throw new HttpException('Failed to generate QR image', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('guest/:guestId')
    async getQrCodeByGuest(@Param('guestId') guestId: string) {
        const qrCode = await this.qrCodesService.findByGuestId(guestId);
        if (!qrCode) {
            throw new HttpException('QR code not found', HttpStatus.NOT_FOUND);
        }

        const qrCodeImage = await this.qrCodesService.generateQrCodeImage(qrCode.qrCodeData);

        return {
            alphanumericCode: qrCode.alphanumericCode,
            qrCodeImage,
            guest: qrCode.guest
        };
    }
}