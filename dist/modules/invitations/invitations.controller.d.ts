import { Response } from 'express';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
export declare class InvitationsController {
    private readonly invitationsService;
    private readonly logger;
    constructor(invitationsService: InvitationsService);
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
    remove(id: string): Promise<{
        message: string;
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
    listTemplates(): Promise<{
        file: string;
        templateName: string;
        imageUrl: string;
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
    previewInvitation(id: string, res: Response): Promise<void>;
}
