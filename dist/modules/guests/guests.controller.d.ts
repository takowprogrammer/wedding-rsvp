import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Response } from 'express';
export declare class GuestsController {
    private readonly guestsService;
    private readonly logger;
    constructor(guestsService: GuestsService);
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
    createWithQRCode(body: {
        name: string;
        email: string;
        phone: string;
    }, res: Response): Promise<void>;
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
    findAllAdmin(groupId?: string, search?: string, page?: string, limit?: string): Promise<{
        guests: ({
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
        })[];
        total: number;
    }>;
    getStats(): Promise<{
        totalRSVPs: number;
        confirmed: number;
        checkedIn: number;
        totalGuests: number;
    }>;
    getExtendedStats(eventDate?: string): Promise<{
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
    remove(id: string): Promise<{
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
    findAllUnpaginated(): Promise<({
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
