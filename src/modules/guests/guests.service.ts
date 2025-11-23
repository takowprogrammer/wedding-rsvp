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
        this.logger.log(`🚀 [GuestsService] Starting async email sending for ${guest.email}`);
        this.logger.log(`   Guest ID: ${guest.id}`);
        this.logger.log(`   Alphanumeric Code: ${alphanumericCode}`);
        this.logger.log(`   QR Code Image Size: ${qrCodeImage.length} characters`);

        try {
            this.logger.log(`📧 [GuestsService] Calling mailer service...`);

            // Read and prepare the email template
            let html = this.mailerService.readTemplate('guest-qr-code.html');
            html = html.replace(/__GUEST_NAME__/g, guest.firstName);
            html = html.replace(/__ALPHANUMERIC_CODE__/g, alphanumericCode);
            // Build public URL to render QR as an image inside email content
            const backendBase = process.env.PUBLIC_BACKEND_URL || process.env.BACKEND_PUBLIC_URL || 'http://localhost:5000';
            const qrPublicUrl = `${backendBase}/api/qr-codes/guest/${guest.id}/image`;
            // Replace CID placeholder with public URL so Gmail/Hotmail render inline
            html = html.replace(/cid:qrcode/g, qrPublicUrl);
            // Replace download link placeholder with public URL
            html = html.replace(/__QR_CODE_DATA_URL__/g, qrPublicUrl);

            const mailOptions = {
                to: guest.email,
                subject: 'Your Wedding Invitation QR Code',
                html,
                // Keep attachment for convenience
                attachments: [{
                    filename: `qrcode-${alphanumericCode}.png`,
                    content: qrCodeImage.split(';base64,').pop(),
                    encoding: 'base64'
                }]
            };

            await this.mailerService.sendMail(mailOptions);
            this.logger.log(`✅ [GuestsService] Email sent successfully to ${guest.email}`);
        } catch (emailError) {
            this.logger.error(`❌ [GuestsService] Failed to send email to ${guest.email}:`, emailError);
            this.logger.error(`   Error type: ${emailError.constructor.name}`);
            this.logger.error(`   Error message: ${emailError.message}`);
            this.logger.error(`   Error code: ${emailError.code || 'N/A'}`);
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
        // Manually delete related records first to handle foreign key constraints
        // since cascade delete might not be fully configured in the DB for all relations

        // 1. Delete ScanLogs
        await this.prisma.scanLog.deleteMany({
            where: { guestId: id }
        });

        // 2. Delete EmailLogs
        await this.prisma.emailLog.deleteMany({
            where: { guestId: id }
        });

        // 3. Delete QrCode (if exists)
        // Note: QrCode has onDelete: Cascade in schema, but good to be explicit or safe
        // If we rely on schema cascade for QrCode, we can skip this, but let's be safe
        // Actually, QrCode is 1:1, so we can let Prisma handle it if configured, 
        // but scanLogs and emailLogs are 1:N and might not have cascade.

        // 4. Delete InvitationDeliveries if any (though they link to Invitation, not Guest directly usually, 
        // but check if Guest has other relations)

        // Finally delete the guest
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