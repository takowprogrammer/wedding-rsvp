import { CreateInvitationDto } from './dto/create-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class InvitationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createInvitationDto: CreateInvitationDto): Promise<{
        id: string;
        templateName: string;
        title: string;
        message: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        templateName: string;
        title: string;
        message: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        templateName: string;
        title: string;
        message: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findActive(): Promise<{
        id: string;
        templateName: string;
        title: string;
        message: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    private getTemplateImageUrl;
    generateInvitationHtml(id: string): Promise<string>;
}
