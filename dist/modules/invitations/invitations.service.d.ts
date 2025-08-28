import { CreateInvitationDto } from './dto/create-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class InvitationsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(createInvitationDto: CreateInvitationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        templateName: string;
        title: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        templateName: string;
        title: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        templateName: string;
        title: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    findActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        message: string;
        templateName: string;
        title: string;
        imageUrl: string | null;
        buttonText: string;
        formUrl: string | null;
        isActive: boolean;
    }[]>;
    private getTemplateImageUrl;
    generateInvitationHtml(id: string): Promise<string>;
}
