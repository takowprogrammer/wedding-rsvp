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
var ThankYouService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThankYouService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mailer_service_1 = require("../mailer/mailer.service");
let ThankYouService = ThankYouService_1 = class ThankYouService {
    constructor(prisma, mailer) {
        this.prisma = prisma;
        this.mailer = mailer;
        this.logger = new common_1.Logger(ThankYouService_1.name);
    }
    buildEmailHtml(guest) {
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
            }
            catch (error) {
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
        const weddingDateStr = process.env.WEDDING_DATE;
        if (!weddingDateStr)
            return;
        const weddingDate = new Date(weddingDateStr + 'T00:00:00Z');
        const now = new Date();
        const msInDay = 24 * 60 * 60 * 1000;
        if (now.getTime() - weddingDate.getTime() >= 2 * msInDay) {
            await this.sendThankYouEmailsForAttendees();
        }
    }
};
exports.ThankYouService = ThankYouService;
exports.ThankYouService = ThankYouService = ThankYouService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mailer_service_1.MailerService])
], ThankYouService);
//# sourceMappingURL=thank-you.service.js.map