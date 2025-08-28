import { CreateGuestDto } from './dto/create-guest.dto';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
export declare class GuestsService {
    private prisma;
    private qrCodesService;
    private mailerService;
    private readonly logger;
    constructor(prisma: PrismaService, qrCodesService: QrCodesService, mailerService: MailerService);
    create(createGuestDto: CreateGuestDto): Promise<{
        guest: {
            id: string;
            createdAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            numberOfGuests: number;
            dietaryRestrictions: string | null;
            specialRequests: string | null;
            status: import(".prisma/client").$Enums.Status;
            checkedIn: boolean;
            checkedInAt: Date | null;
            updatedAt: Date;
            groupId: string | null;
            thankYouSentAt: Date | null;
            sourceInvitationId: string | null;
        };
        qrCode: {
            alphanumericCode: string;
            qrCodeImage: string;
        };
    }>;
    findAll(): Promise<({
        qrCode: {
            id: string;
            alphanumericCode: string;
            qrCodeData: string;
            used: boolean;
            createdAt: Date;
            guestId: string;
        };
        group: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        updatedAt: Date;
        groupId: string | null;
        thankYouSentAt: Date | null;
        sourceInvitationId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        qrCode: {
            id: string;
            alphanumericCode: string;
            qrCodeData: string;
            used: boolean;
            createdAt: Date;
            guestId: string;
        };
        group: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        updatedAt: Date;
        groupId: string | null;
        thankYouSentAt: Date | null;
        sourceInvitationId: string | null;
    }>;
    getStats(): Promise<{
        totalRSVPs: number;
        confirmed: number;
        checkedIn: number;
        totalGuests: number;
    }>;
    getExtendedStats(eventDateISO?: string): Promise<{
        attendance: {
            confirmed: number;
            checkedIn: number;
            noShows: number;
            showRate: number;
            checkinTimeline: {
                hour: string;
                count: number;
            }[];
            totalExpectedGuests: number;
        };
        qr: {
            codesGenerated: number;
            codesUsed: number;
            scanSuccess: number;
            scanFailures: number;
            scanByMethod: {
                manual: number;
                scan: number;
            };
        };
        communication: {
            thankYouSent: number;
            emailFailures: number;
        };
    }>;
    findAllAdmin(groupId?: string, search?: string, page?: number, limit?: number): Promise<{
        guests: ({
            qrCode: {
                id: string;
                alphanumericCode: string;
                qrCodeData: string;
                used: boolean;
                createdAt: Date;
                guestId: string;
            };
            group: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            numberOfGuests: number;
            dietaryRestrictions: string | null;
            specialRequests: string | null;
            status: import(".prisma/client").$Enums.Status;
            checkedIn: boolean;
            checkedInAt: Date | null;
            updatedAt: Date;
            groupId: string | null;
            thankYouSentAt: Date | null;
            sourceInvitationId: string | null;
        })[];
        total: number;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        updatedAt: Date;
        groupId: string | null;
        thankYouSentAt: Date | null;
        sourceInvitationId: string | null;
    }>;
    findAllUnpaginated(): Promise<({
        qrCode: {
            id: string;
            alphanumericCode: string;
            qrCodeData: string;
            used: boolean;
            createdAt: Date;
            guestId: string;
        };
        group: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        updatedAt: Date;
        groupId: string | null;
        thankYouSentAt: Date | null;
        sourceInvitationId: string | null;
    })[]>;
}
