import { PrismaService } from '../prisma/prisma.service';
export declare class QrCodesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateQrCode(guestId: string): Promise<{
        id: string;
        alphanumericCode: string;
        qrCodeData: string;
        used: boolean;
        createdAt: Date;
        guestId: string;
    }>;
    generateQrCodeImage(qrCodeData: string): Promise<string>;
    private generateAlphanumericCode;
    verifyCode(code: string): Promise<{
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
    } & {
        id: string;
        alphanumericCode: string;
        qrCodeData: string;
        used: boolean;
        createdAt: Date;
        guestId: string;
    }>;
    logScan(params: {
        guestId?: string;
        qrCodeId?: string;
        method: 'SCAN' | 'MANUAL';
        success: boolean;
        reason?: string;
    }): Promise<void>;
    checkInGuest(code: string): Promise<{
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
    } & {
        id: string;
        alphanumericCode: string;
        qrCodeData: string;
        used: boolean;
        createdAt: Date;
        guestId: string;
    }>;
    findByGuestId(guestId: string): Promise<{
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
    } & {
        id: string;
        alphanumericCode: string;
        qrCodeData: string;
        used: boolean;
        createdAt: Date;
        guestId: string;
    }>;
}
