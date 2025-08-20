import { Response } from 'express';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
export declare class InvitationsController {
    private readonly invitationsService;
    private readonly logger;
    constructor(invitationsService: InvitationsService);
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
    remove(id: string): Promise<{
        message: string;
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
    listTemplates(): Promise<{
        file: string;
        templateName: string;
        imageUrl: string;
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
    previewInvitation(id: string, res: Response): Promise<void>;
}
