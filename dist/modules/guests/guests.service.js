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
var GuestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestsService = void 0;
const common_1 = require("@nestjs/common");
const qr_codes_service_1 = require("../qr-codes/qr-codes.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mailer_service_1 = require("../mailer/mailer.service");
let GuestsService = GuestsService_1 = class GuestsService {
    constructor(prisma, qrCodesService, mailerService) {
        this.prisma = prisma;
        this.qrCodesService = qrCodesService;
        this.mailerService = mailerService;
        this.logger = new common_1.Logger(GuestsService_1.name);
    }
    async create(createGuestDto) {
        try {
            const savedGuest = await this.prisma.guest.create({
                data: {
                    firstName: createGuestDto.firstName,
                    lastName: createGuestDto.lastName,
                    email: createGuestDto.email,
                    phone: createGuestDto.phone,
                    numberOfGuests: createGuestDto.numberOfGuests,
                    dietaryRestrictions: createGuestDto.dietaryRestrictions,
                    specialRequests: createGuestDto.specialRequests,
                    status: 'CONFIRMED',
                    groupId: createGuestDto.groupId ?? undefined,
                },
            });
            if (!savedGuest) {
                throw new Error('Guest creation failed.');
            }
            this.logger.log(`Guest created successfully with ID: ${savedGuest.id}`);
            this.logger.log('Generating QR code...');
            const qrCode = await this.qrCodesService.generateQrCode(savedGuest.id);
            this.logger.log(`QR code generated: ${qrCode.alphanumericCode}`);
            this.logger.log('Generating QR code image...');
            const qrCodeImage = await this.qrCodesService.generateQrCodeImage(qrCode.qrCodeData);
            this.logger.log('QR code image generated successfully');
            const result = {
                guest: savedGuest,
                qrCode: {
                    alphanumericCode: qrCode.alphanumericCode,
                    qrCodeImage,
                },
            };
            this.logger.log('Guest creation completed successfully');
            try {
                await this.mailerService.sendGuestQrCodeEmail(savedGuest, {
                    alphanumericCode: qrCode.alphanumericCode,
                    qrCodeImage: qrCodeImage,
                });
                this.logger.log(`Email sent successfully to ${savedGuest.email}`);
            }
            catch (emailError) {
                this.logger.error(`Failed to send email to ${savedGuest.email}:`, emailError);
            }
            return result;
        }
        catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new common_1.ConflictException('A guest with this email address has already RSVP\'d.');
            }
            this.logger.error('Error creating guest:', error.message);
            throw error;
        }
    }
    async findAll() {
        return await this.prisma.guest.findMany({
            include: { qrCode: true, group: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        return await this.prisma.guest.findUnique({
            where: { id },
            include: { qrCode: true, group: true }
        });
    }
    async getStats() {
        const total = await this.prisma.guest.count();
        const confirmed = await this.prisma.guest.count({ where: { status: 'CONFIRMED' } });
        const checkedIn = await this.prisma.guest.count({ where: { checkedIn: true } });
        const totalGuestsResult = await this.prisma.guest.aggregate({ _sum: { numberOfGuests: true } });
        return {
            totalRSVPs: total,
            confirmed,
            checkedIn,
            totalGuests: totalGuestsResult._sum.numberOfGuests || 0
        };
    }
    async getExtendedStats(eventDateISO) {
        const [confirmed, checkedIn, totalExpectedAgg] = await Promise.all([
            this.prisma.guest.count({ where: { status: 'CONFIRMED' } }),
            this.prisma.guest.count({ where: { checkedIn: true } }),
            this.prisma.guest.aggregate({ _sum: { numberOfGuests: true }, where: { status: 'CONFIRMED' } }),
        ]);
        const noShows = Math.max(confirmed - checkedIn, 0);
        const showRate = confirmed > 0 ? Number(((checkedIn / confirmed) * 100).toFixed(1)) : 0;
        let checkinTimeline = [];
        if (eventDateISO) {
            const date = new Date(eventDateISO);
            const start = new Date(date);
            start.setUTCHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setUTCDate(end.getUTCDate() + 1);
            const rows = await this.prisma.guest.groupBy({
                by: ['checkedInAt'],
                where: { checkedIn: true, checkedInAt: { gte: start, lt: end } },
                _count: true,
            });
            const buckets = {};
            rows.forEach(r => {
                const d = r.checkedInAt;
                if (d) {
                    const hour = d.toISOString().slice(11, 13);
                    buckets[hour] = (buckets[hour] || 0) + 1;
                }
            });
            checkinTimeline = Array.from({ length: 24 }).map((_, h) => {
                const hour = h.toString().padStart(2, '0');
                return { hour, count: buckets[hour] || 0 };
            });
        }
        const [codesGenerated, codesUsed, scanSuccess, scanFailures, scanManual, scanScan] = await Promise.all([
            this.prisma.qrCode.count(),
            this.prisma.qrCode.count({ where: { used: true } }),
            this.prisma.scanLog.count({ where: { success: true } }),
            this.prisma.scanLog.count({ where: { success: false } }),
            this.prisma.scanLog.count({ where: { method: 'MANUAL' } }),
            this.prisma.scanLog.count({ where: { method: 'SCAN' } }),
        ]);
        const [thankYouSent, emailFailures] = await Promise.all([
            this.prisma.guest.count({ where: { thankYouSentAt: { not: null } } }),
            this.prisma.emailLog.count({ where: { status: 'FAILED' } }),
        ]);
        return {
            attendance: {
                confirmed,
                checkedIn,
                noShows,
                showRate,
                checkinTimeline,
                totalExpectedGuests: totalExpectedAgg._sum.numberOfGuests || 0,
            },
            qr: {
                codesGenerated,
                codesUsed,
                scanSuccess,
                scanFailures,
                scanByMethod: { manual: scanManual, scan: scanScan },
            },
            communication: {
                thankYouSent,
                emailFailures,
            },
        };
    }
    async findAllAdmin(groupId, search, page = 1, limit = 10) {
        const where = {};
        if (groupId && groupId.trim() !== '') {
            where.groupId = groupId;
        }
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        console.log(`Finding all admin guests in service... Page: ${page}, Limit: ${limit}, GroupId: ${groupId}, Search: ${search}`);
        console.log('Where clause:', JSON.stringify(where, null, 2));
        const [guests, total] = await this.prisma.$transaction([
            this.prisma.guest.findMany({
                where,
                include: {
                    group: true,
                    qrCode: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.guest.count({ where }),
        ]);
        console.log(`Guests found in service: ${guests.length}, Total: ${total}`);
        return { guests, total };
    }
    async remove(id) {
        return await this.prisma.guest.delete({
            where: { id },
        });
    }
    async findAllUnpaginated() {
        return await this.prisma.guest.findMany({
            include: {
                group: true,
                qrCode: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.GuestsService = GuestsService;
exports.GuestsService = GuestsService = GuestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        qr_codes_service_1.QrCodesService,
        mailer_service_1.MailerService])
], GuestsService);
//# sourceMappingURL=guests.service.js.map