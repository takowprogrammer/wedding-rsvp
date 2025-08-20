import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class ThankYouService {
    private readonly logger = new Logger(ThankYouService.name);

    constructor(
        private prisma: PrismaService,
        private mailer: MailerService,
    ) { }

    private buildEmailHtml(guest: { firstName: string; lastName: string }) {
        const coupleNames = process.env.COUPLE_NAMES || 'We';
        const albumUrl = process.env.THANK_YOU_ALBUM_URL || '#';
        return `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <div style="text-align:center; padding: 24px 0;">
              <h2 style="margin:0; color:#333;">Thank You</h2>
            </div>
            <div style="background:#fff; border-radius:12px; padding:24px; border:1px solid #eee;">
              <p style="color:#333;">Dear ${guest.firstName},</p>
              <p style="color:#444; line-height:1.6;">${coupleNames} would like to thank you for being part of our special day. Your presence truly made it unforgettable.</p>
              <p style="color:#444; line-height:1.6;">We have started to collect some photos here:</p>
              <p><a href="${albumUrl}" style="background:#ec4899; color:white; padding:10px 16px; text-decoration:none; border-radius:8px;">View Photos</a></p>
              <p style="color:#666; font-size:12px; margin-top:24px;">If the button does not work, copy this link: ${albumUrl}</p>
            </div>
          </div>
        `;
    }

    async sendThankYouEmailsForAttendees() {
        const attendees = await this.prisma.guest.findMany({
            where: {
                status: 'CONFIRMED',
                checkedIn: true,
                thankYouSentAt: null,
            },
            select: { id: true, email: true, firstName: true, lastName: true },
        });

        for (const guest of attendees) {
            try {
                const messageId = await this.mailer.sendMail({
                    to: guest.email,
                    subject: 'Thank you for celebrating with us',
                    html: this.buildEmailHtml(guest),
                });
                await this.prisma.$transaction([
                    this.prisma.guest.update({ where: { id: guest.id }, data: { thankYouSentAt: new Date() } }),
                    this.prisma.emailLog.create({
                        data: {
                            messageId,
                            guestId: guest.id,
                            type: 'THANK_YOU',
                            status: 'SENT',
                            sentAt: new Date(),
                        }
                    })
                ]);
            } catch (error) {
                this.logger.error(`Failed to send thank-you to ${guest.email}: ${error?.message || error}`);
                await this.prisma.emailLog.create({
                    data: {
                        messageId: `failed_${guest.id}_${Date.now()}`,
                        guestId: guest.id,
                        type: 'THANK_YOU',
                        status: 'FAILED',
                        error: error?.message || String(error),
                        sentAt: new Date(),
                    }
                });
            }
        }
    }

    async sendIfAfterWedding() {
        const weddingDateStr = process.env.WEDDING_DATE; // e.g., 2025-01-20
        if (!weddingDateStr) return;
        const weddingDate = new Date(weddingDateStr + 'T00:00:00Z');
        const now = new Date();
        const msInDay = 24 * 60 * 60 * 1000;
        if (now.getTime() - weddingDate.getTime() >= 2 * msInDay) {
            await this.sendThankYouEmailsForAttendees();
        }
    }
} 