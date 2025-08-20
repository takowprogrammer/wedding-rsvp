import { CreateGuestDto } from './dto/create-guest.dto';
import { QrCodesService } from '../qr-codes/qr-codes.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class GuestsService {
    private prisma;
    private qrCodesService;
    private readonly logger;
    constructor(prisma: PrismaService, qrCodesService: QrCodesService);
    create(createGuestDto: CreateGuestDto): Promise<{
        guest: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            numberOfGuests: number;
            dietaryRestrictions: string | null;
            specialRequests: string | null;
            status: import(".prisma/client").$Enums.Status;
            checkedIn: boolean;
            checkedInAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            thankYouSentAt: Date | null;
            groupId: string | null;
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
            createdAt: Date;
            alphanumericCode: string;
            qrCodeData: string;
            used: boolean;
            guestId: string;
        };
        group: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        thankYouSentAt: Date | null;
        groupId: string | null;
        sourceInvitationId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        qrCode: {
            id: string;
            createdAt: Date;
            alphanumericCode: string;
            qrCodeData: string;
            used: boolean;
            guestId: string;
        };
        group: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        thankYouSentAt: Date | null;
        groupId: string | null;
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
    findAllAdmin(groupId?: string): Promise<({
        qrCode: {
            id: string;
            createdAt: Date;
            alphanumericCode: string;
            qrCodeData: string;
            used: boolean;
            guestId: string;
        };
        group: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        numberOfGuests: number;
        dietaryRestrictions: string | null;
        specialRequests: string | null;
        status: import(".prisma/client").$Enums.Status;
        checkedIn: boolean;
        checkedInAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        thankYouSentAt: Date | null;
        groupId: string | null;
        sourceInvitationId: string | null;
    })[]>;
}
