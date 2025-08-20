import { QrCodesService } from './qr-codes.service';
export declare class QrCodesController {
    private readonly qrCodesService;
    constructor(qrCodesService: QrCodesService);
    verifyCode(code: string): Promise<{
        valid: boolean;
        guest: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            groupId: string | null;
            thankYouSentAt: Date | null;
            sourceInvitationId: string | null;
        };
        used: boolean;
    }>;
    checkInGuest(code: string): Promise<{
        success: boolean;
        guest: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            groupId: string | null;
            thankYouSentAt: Date | null;
            sourceInvitationId: string | null;
        };
        message: string;
    }>;
    getQrCodeByGuest(guestId: string): Promise<{
        alphanumericCode: string;
        qrCodeImage: string;
        guest: {
            id: string;
            createdAt: Date;
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
            updatedAt: Date;
            groupId: string | null;
            thankYouSentAt: Date | null;
            sourceInvitationId: string | null;
        };
    }>;
}
