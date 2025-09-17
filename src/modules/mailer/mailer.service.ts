import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
    private resend: Resend;
    private isEmailEnabled: boolean = true;
    private apiKey: string | undefined;

    constructor() {
        console.log('🔧 [MailerService] Initializing Resend email service...');
        this.apiKey = process.env.RESEND_API_KEY;

        if (!this.apiKey) {
            console.log('⚠️  [MailerService] RESEND_API_KEY is not set. Disabling email service.');
            this.isEmailEnabled = false;
            this.resend = null as any; // Avoid TS error
        } else {
            console.log('✅ [MailerService] Resend API key is set.');
            console.log(`   API Key length: ${this.apiKey.length}`);
            console.log(`   API Key prefix: ${this.apiKey.substring(0, 8)}...`);
            console.log(`   API Key suffix: ...${this.apiKey.substring(this.apiKey.length - 4)}`);
            this.resend = new Resend(this.apiKey);
            this.isEmailEnabled = true; // Assume enabled if key is present
        }
    }

    private async testConnection() {
        // This method is no longer needed and is the source of the API key error.
        // Keeping it here but empty to avoid breaking other parts of the code if it were called elsewhere.
    }

    async sendMail(options: { to: string; subject: string; html: string; from?: string; attachments?: any[] }): Promise<string> {
        if (!this.isEmailEnabled) {
            const errorMessage = 'Email service is disabled. Check logs for RESEND_API_KEY or connection issues.';
            console.log(`⚠️  [MailerService] ${errorMessage}`);
            console.log(`   Would have sent to: ${options.to}`);
            console.log(`   Subject: ${options.subject}`);
            throw new Error(errorMessage);
        }

        let from = options.from || process.env.MAIL_FROM || 'onboarding@resend.dev';
        if (!from) {
            const errorMessage = 'MAIL_FROM environment variable is not set.';
            console.error(`❌ [MailerService] ${errorMessage}`);
            throw new Error(errorMessage);
        }

        // Ensure the from field is properly formatted for Resend
        // Resend expects either "email@example.com" or "Name <email@example.com>"
        if (from.includes('<') && !from.endsWith('>')) {
            from = from + '>';
            console.log(`🔧 [MailerService] Fixed malformed from field: ${from}`);
        }

        // Check if using a domain that needs verification
        if (from.includes('@gmail.com') || from.includes('@yahoo.com') || from.includes('@hotmail.com')) {
            console.log('⚠️  [MailerService] Using a public email domain. Consider using your own verified domain or onboarding@resend.dev for testing.');
        }

        // Additional validation for Resend format
        if (!from.match(/^[^<]+<[^>]+>$/)) {
            // If it doesn't match the "Name <email>" format, check if it's just an email
            if (!from.match(/^[^\s<]+@[^\s>]+$/)) {
                console.warn(`⚠️  [MailerService] From field may not be properly formatted: ${from}`);
            }
        }

        console.log('📤 [MailerService] Attempting to send email via Resend...');
        console.log(`   To: ${options.to}`);
        console.log(`   From: ${from}`);
        console.log(`   Subject: ${options.subject}`);
        console.log(`   Has attachments: ${options.attachments ? options.attachments.length : 0}`);

        const startTime = Date.now();

        try {
            console.log('🔍 [MailerService] Sending request to Resend API...');
            console.log(`   API Key present: ${!!this.apiKey}`);
            console.log(`   API Key length: ${this.apiKey?.length || 0}`);
            console.log(`   API Key prefix: ${this.apiKey?.substring(0, 8) || 'N/A'}...`);

            const { data, error } = await this.resend.emails.send({
                from: from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                attachments: options.attachments,
            });

            if (error) {
                console.error('❌ [MailerService] Failed to send email via Resend:', error);
                console.error('   Error details:', JSON.stringify(error, null, 2));
                throw new Error(`Failed to send email: ${error.message}`);
            }

            const duration = Date.now() - startTime;
            console.log(`✅ [MailerService] Email sent successfully in ${duration}ms`);
            console.log(`   Message ID: ${data?.id}`);
            return data?.id ?? 'unknown-id';
        } catch (error: any) {
            const duration = Date.now() - startTime;
            console.error(`❌ [MailerService] Error sending email after ${duration}ms:`, error);
            console.error('   Error type:', error.constructor.name);
            console.error('   Error message:', error.message);
            console.error('   Error code:', error.code || 'N/A');
            console.error('   Error status:', error.status || 'N/A');

            if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
                throw new Error('Email service is unavailable. Please check your internet connection and try again.');
            }

            if (error.message?.includes('Unable to fetch data')) {
                throw new Error('Network error: Unable to connect to email service. Please check your internet connection.');
            }

            if (error.message?.includes('validation_error')) {
                throw new Error(`Email validation error: ${error.message}`);
            }

            throw error;
        }
    }

    // Helper to read email templates (no change needed here)
    readTemplate(templateName: string): string {
        try {
            const templatePath = path.join(
                process.cwd(),
                'dist', // or 'src' if you are running in dev mode with ts-node
                'modules',
                'mailer',
                'templates',
                templateName,
            );
            return fs.readFileSync(templatePath, 'utf-8');
        } catch (error) {
            console.error(`❌ [MailerService] Error reading email template "${templateName}":`, error);
            throw new Error(`Template not found: ${templateName}`);
        }
    }
} 