import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class GuestsService {
    private readonly logger = new Logger(GuestsService.name);

    constructor(
        private prisma: PrismaService,
        private qrCodesService: QrCodesService,
        private mailerService: MailerService,
    ) { }

    async create(createGuestDto: CreateGuestDto) {
        try {
            // Create guest
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

            // Generate QR code only if guest creation succeeds
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

            // Send email with QR code asynchronously (don't await)
            this.sendEmailAsync(savedGuest, qrCode.alphanumericCode, qrCodeImage);

            return result;

        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                throw new ConflictException('A guest with this email address has already RSVP\'d.');
            }
            this.logger.error('Error creating guest:', error.message);
            throw error;
        }
    }

    private async sendEmailAsync(guest: any, alphanumericCode: string, qrCodeImage: string) {
        try {
            await this.mailerService.sendGuestQrCodeEmail(guest, {
                alphanumericCode,
                qrCodeImage,
            });
            this.logger.log(`Email sent successfully to ${guest.email}`);
        } catch (emailError) {
            this.logger.error(`Failed to send email to ${guest.email}:`, emailError);
            // Email failure is logged but doesn't affect the guest creation
        }
    }

    async findAll() {
        return await this.prisma.guest.findMany({
            include: { qrCode: true, group: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
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

    async getExtendedStats(eventDateISO?: string) {
        // Attendance
        const [confirmed, checkedIn, totalExpectedAgg] = await Promise.all([
            this.prisma.guest.count({ where: { status: 'CONFIRMED' } }),
            this.prisma.guest.count({ where: { checkedIn: true } }),
            this.prisma.guest.aggregate({ _sum: { numberOfGuests: true }, where: { status: 'CONFIRMED' } }),
        ]);
        const noShows = Math.max(confirmed - checkedIn, 0);
        const showRate = confirmed > 0 ? Number(((checkedIn / confirmed) * 100).toFixed(1)) : 0;

        // Check-in timeline (by hour) on event day
        let checkinTimeline: Array<{ hour: string; count: number }> = [];
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
            const buckets: Record<string, number> = {};
            rows.forEach(r => {
                const d = r.checkedInAt as Date | null;
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

        // QR code performance
        const [codesGenerated, codesUsed, scanSuccess, scanFailures, scanManual, scanScan] = await Promise.all([
            this.prisma.qrCode.count(),
            this.prisma.qrCode.count({ where: { used: true } }),
            this.prisma.scanLog.count({ where: { success: true } }),
            this.prisma.scanLog.count({ where: { success: false } }),
            this.prisma.scanLog.count({ where: { method: 'MANUAL' } as any }),
            this.prisma.scanLog.count({ where: { method: 'SCAN' } as any }),
        ]);

        // Communication
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

    async findAllAdmin(groupId?: string, search?: string, page: number = 1, limit: number = 10) {
        const where: any = {};

        // Only add groupId filter if it's provided and not empty
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

        return { guests, total };
    }

    async remove(id: string) {
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
}