import { Injectable, Logger } from '@nestjs/common';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationsService {
    private readonly logger = new Logger(InvitationsService.name);

    constructor(
        private prisma: PrismaService,
    ) { }

    async create(createInvitationDto: CreateInvitationDto) {
        this.logger.log(`Creating invitation: ${createInvitationDto.title}`);
        this.logger.debug('Invitation data:', JSON.stringify(createInvitationDto, null, 2));

        try {
            const result = await this.prisma.invitation.create({
                data: createInvitationDto
            });

            this.logger.log(`Invitation created successfully with ID: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to create invitation:', error);
            throw error;
        }
    }

    async findAll() {
        return await this.prisma.invitation.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { id }
        });
        if (!invitation) {
            throw new Error('Invitation not found');
        }
        return invitation;
    }

    async remove(id: string) {
        const invitation = await this.findOne(id);
        await this.prisma.invitation.delete({
            where: { id }
        });
        return { message: 'Invitation deleted successfully' };
    }

    async findActive() {
        return await this.prisma.invitation.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    private getTemplateImageUrl(templateName?: string, providedImageUrl?: string): string | undefined {
        if (providedImageUrl) return providedImageUrl;
        if (!templateName) return undefined;
        // map template name to png in public/invitations
        const safe = templateName.trim().toLowerCase().replace(/\s+/g, '_');
        return `/invitations/${safe}.png`;
    }

    async generateInvitationHtml(id: string): Promise<string> {
        const invitation = await this.findOne(id);
        if (!invitation) {
            throw new Error('Invitation not found');
        }

        const imageUrl = this.getTemplateImageUrl(invitation.templateName, invitation.imageUrl);

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${invitation.title}</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .invitation-card {
            max-width: 500px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
            text-align: center;
            position: relative;
        }
        .invitation-image {
            width: 100%;
            height: auto;
            object-fit: cover;
            border-radius: 20px 20px 0 0;
        }
        .invitation-content {
            padding: 30px;
        }
        .invitation-title {
            font-size: 28px;
            color: #2c3e50;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .invitation-message {
            font-size: 16px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .rsvp-button {
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .rsvp-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
        }
        .decorative-border {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #ff6b6b, #ee5a24, #ff6b6b);
        }
    </style>
</head>
<body>
    <div class="invitation-card">
        <div class="decorative-border"></div>
        ${imageUrl ? `<img src="${imageUrl}" alt="Wedding Invitation" class="invitation-image">` : ''}
        <div class="invitation-content">
            <h1 class="invitation-title">${invitation.title}</h1>
            <p class="invitation-message">${invitation.message}</p>
            <a href="${invitation.formUrl}" class="rsvp-button">${invitation.buttonText}</a>
        </div>
    </div>
</body>
</html>`;
    }
}