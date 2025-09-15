import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
    private transporter: nodemailer.Transporter;
    private isEmailEnabled: boolean = true;

    constructor() {
        console.log('🔧 [MailerService] Initializing email service...');
        console.log('📧 [MailerService] SMTP Configuration:');
        console.log(`   Host: ${process.env.SMTP_HOST || 'NOT SET'}`);
        console.log(`   Port: ${process.env.SMTP_PORT || '587'}`);
        console.log(`   Secure: ${process.env.SMTP_SECURE === 'true'}`);
        console.log(`   User: ${process.env.SMTP_USER ? 'SET' : 'NOT SET'}`);
        console.log(`   Pass: ${process.env.SMTP_PASS ? 'SET' : 'NOT SET'}`);
        console.log(`   From: ${process.env.MAIL_FROM || 'NOT SET'}`);

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            } : undefined,
            // Add timeout configuration
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 5000,    // 5 seconds
            socketTimeout: 10000,     // 10 seconds
        });

        // Test SMTP connection on startup
        this.testConnection();
    }

    private async testConnection() {
        try {
            console.log('🔍 [MailerService] Testing SMTP connection...');
            console.log('🔍 [MailerService] Full SMTP config:', {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === 'true',
                hasAuth: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
                connectionTimeout: 10000,
                greetingTimeout: 5000,
                socketTimeout: 10000
            });
            
            // Test basic connectivity first
            console.log('🔍 [MailerService] Testing basic connectivity...');
            const net = require('net');
            const socket = new net.Socket();
            
            await new Promise((resolve, reject) => {
                socket.setTimeout(5000);
                socket.connect(Number(process.env.SMTP_PORT || 587), process.env.SMTP_HOST, () => {
                    console.log('✅ [MailerService] Basic connectivity test passed');
                    socket.destroy();
                    resolve(true);
                });
                socket.on('error', (err) => {
                    console.error('❌ [MailerService] Basic connectivity test failed:', err.message);
                    reject(err);
                });
                socket.on('timeout', () => {
                    console.error('❌ [MailerService] Basic connectivity test timed out');
                    socket.destroy();
                    reject(new Error('Connection timeout'));
                });
            });
            
            await this.transporter.verify();
            console.log('✅ [MailerService] SMTP connection verified successfully');
        } catch (error) {
            console.error('❌ [MailerService] SMTP connection failed:', error.message);
            console.error('🔍 [MailerService] Error details:', {
                code: error.code,
                command: error.command,
                response: error.response,
                responseCode: error.responseCode
            });
            
            // Provide specific troubleshooting advice
            if (error.code === 'ETIMEDOUT') {
                console.error('💡 [MailerService] TROUBLESHOOTING: Connection timeout detected');
                console.error('   - Check if SMTP_HOST is correct and reachable');
                console.error('   - Verify SMTP_PORT is correct (587 for TLS, 465 for SSL)');
                console.error('   - Check if Railway has outbound email access');
                console.error('   - Consider using a different SMTP provider');
                console.error('⚠️  [MailerService] Disabling email service due to connection failure');
                this.isEmailEnabled = false;
            }
        }
    }

    async sendMail(options: { to: string; subject: string; html: string; from?: string; attachments?: any[] }): Promise<string> {
        if (!this.isEmailEnabled) {
            console.log('⚠️  [MailerService] Email service is disabled due to SMTP connection issues');
            console.log(`   Would have sent to: ${options.to}`);
            console.log(`   Subject: ${options.subject}`);
            throw new Error('Email service is disabled due to SMTP connection issues');
        }

        const from = options.from || process.env.MAIL_FROM || 'no-reply@wedding.local';
        
        console.log('📤 [MailerService] Attempting to send email...');
        console.log(`   To: ${options.to}`);
        console.log(`   From: ${from}`);
        console.log(`   Subject: ${options.subject}`);
        console.log(`   Has attachments: ${options.attachments ? options.attachments.length : 0}`);
        
        const startTime = Date.now();
        
        try {
            const info = await this.transporter.sendMail({
                from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                attachments: options.attachments,
            });
            
            const duration = Date.now() - startTime;
            console.log(`✅ [MailerService] Email sent successfully in ${duration}ms`);
            console.log(`   Message ID: ${info.messageId}`);
            console.log(`   Response: ${info.response}`);
            
            return info.messageId as string;
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`❌ [MailerService] Email sending failed after ${duration}ms`);
            console.error(`   Error: ${error.message}`);
            console.error(`   Code: ${error.code}`);
            console.error(`   Command: ${error.command}`);
            console.error(`   Response: ${error.response}`);
            console.error(`   Response Code: ${error.responseCode}`);
            throw error;
        }
    }

    async sendGuestQrCodeEmail(guest: { firstName: string, email: string }, qrCode: { alphanumericCode: string, qrCodeImage: string }) {
        console.log('🎯 [MailerService] Preparing QR code email...');
        console.log(`   Guest: ${guest.firstName} (${guest.email})`);
        console.log(`   QR Code: ${qrCode.alphanumericCode}`);
        
        const templatePath = path.join(__dirname, 'templates', 'guest-qr-code.html');
        console.log(`   Template path: ${templatePath}`);
        
        // Check if template file exists
        if (!fs.existsSync(templatePath)) {
            const error = `Email template not found at: ${templatePath}. Current working directory: ${process.cwd()}, __dirname: ${__dirname}`;
            console.error('❌ [MailerService]', error);
            throw new Error(error);
        }
        
        console.log('✅ [MailerService] Template file found, reading content...');
        let html = fs.readFileSync(templatePath, 'utf-8');
        console.log(`   Template size: ${html.length} characters`);

        // Replace placeholders with actual values
        html = html.replace(/__GUEST_NAME__/g, guest.firstName);
        html = html.replace(/__ALPHANUMERIC_CODE__/g, qrCode.alphanumericCode);
        console.log('✅ [MailerService] Template placeholders replaced');

        const qrCodeImageSize = qrCode.qrCodeImage.length;
        console.log(`   QR Code image size: ${qrCodeImageSize} characters`);

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

        console.log('📧 [MailerService] Calling sendMail with prepared options...');
        return this.sendMail(mailOptions);
    }
} 