import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

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

    async sendMail(options: { to: string; subject: string; html: string; from?: string }): Promise<string> {
        const from = options.from || process.env.MAIL_FROM || 'no-reply@wedding.local';
        const info = await this.transporter.sendMail({
            from,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        return info.messageId as string;
    }
} 