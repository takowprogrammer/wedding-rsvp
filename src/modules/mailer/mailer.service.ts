import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            } : undefined,
        });
    }

    async sendMail(options: { to: string; subject: string; html: string; from?: string; attachments?: any[] }): Promise<string> {
        const from = options.from || process.env.MAIL_FROM || 'no-reply@wedding.local';
        const info = await this.transporter.sendMail({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
            attachments: options.attachments,
        });
        return info.messageId as string;
    }

    async sendGuestQrCodeEmail(guest: { firstName: string, email: string }, qrCode: { alphanumericCode: string, qrCodeImage: string }) {
        const templatePath = path.join(__dirname, 'templates', 'guest-qr-code.html');
        let html = fs.readFileSync(templatePath, 'utf-8');

        html = html.replace('__GUEST_NAME__', guest.firstName);
        html = html.replace('__ALPHANUMERIC_CODE__', qrCode.alphanumericCode);

        const mailOptions = {
            to: guest.email,
            subject: 'Your QR Code for the Event',
            html,
            attachments: [{
                filename: 'qrcode.png',
                content: qrCode.qrCodeImage.split(';base64,').pop(),
                encoding: 'base64',
                cid: 'qrcode'
            }]
        };

        return this.sendMail(mailOptions);
    }
} 