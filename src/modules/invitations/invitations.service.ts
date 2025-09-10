import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
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
        this.logger.debug(`Invitation data: ${JSON.stringify(createInvitationDto, null, 2)}`);

        try {
            const { templateName, title, message, imageUrl, buttonText, formUrl, isActive } = createInvitationDto as any;

            const data: any = {
                templateName,
                title,
                message,
                imageUrl: imageUrl ?? undefined,
                buttonText,
                formUrl: formUrl ?? undefined,
            };
            if (typeof isActive === 'boolean') {
                data.isActive = isActive;
            }

            const result = await this.prisma.invitation.create({
                data,
            });

            this.logger.log(`Invitation created successfully with ID: ${result.id}`);
            return result;
        } catch (error: any) {
            this.logger.error(`Failed to create invitation: ${error?.message || error}`);
            this.logger.debug(error?.stack || 'no stack');
            throw new InternalServerErrorException('Failed to create invitation');
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
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow-x: hidden;
        }

        .envelope-container {
            position: relative;
            width: 100%;
            max-width: 700px;
            margin: 20px auto;
        }

        .envelope {
            position: relative;
            width: 100%;
            height: 450px;
            background: linear-gradient(145deg, #f5e6d3 0%, #e6d5c3 50%, #d4c4b0 100%);
            border-radius: 25px;
            box-shadow: 
                0 30px 60px rgba(139, 115, 85, 0.3),
                0 15px 30px rgba(0,0,0,0.2),
                inset 0 2px 4px rgba(255,255,255,0.3);
            border: 3px solid #c4b5a0;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            background-image: 
                linear-gradient(145deg, #f5e6d3 0%, #e6d5c3 50%, #d4c4b0 100%),
                repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(255,255,255,0.1) 2px,
                    rgba(255,255,255,0.1) 4px
                );
        }

        .envelope.open {
            transform: scale(0.95);
            box-shadow: 
                0 15px 30px rgba(139, 115, 85, 0.2),
                0 8px 15px rgba(0,0,0,0.1),
                inset 0 2px 4px rgba(255,255,255,0.3);
        }

        .envelope::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60%;
            background: linear-gradient(135deg, #d4a574 0%, #b8860b 100%);
            clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
            z-index: 1;
            transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-origin: bottom center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .envelope.open::before {
            transform: rotateX(180deg);
            background: linear-gradient(135deg, #b8860b 0%, #d4a574 100%);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .envelope::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
            z-index: 2;
            transition: opacity 0.3s ease;
        }

        .envelope.open::after {
            opacity: 0;
        }

        .envelope-header {
            background: transparent;
            padding: 25px 20px 15px 20px;
            text-align: center;
            border-bottom: none;
            position: relative;
            z-index: 3;
        }

        .envelope-seal {
            width: 80px;
            height: 80px;
            background: linear-gradient(145deg, #8b9dc3 0%, #6b7b9a 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
            margin: 0 auto 20px;
            box-shadow: 
                0 15px 30px rgba(139, 157, 195, 0.4),
                inset 0 2px 4px rgba(255,255,255,0.3);
            border: 4px solid #f5e6d3;
            position: relative;
            z-index: 3;
        }

        .envelope-seal::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #f5e6d3, #e6d5c3);
            border-radius: 50%;
            z-index: -1;
        }

        @keyframes pulse {
            0%, 100% { 
                transform: scale(1);
                box-shadow: 0 15px 30px rgba(139, 157, 195, 0.4);
            }
            50% { 
                transform: scale(1.05);
                box-shadow: 0 20px 40px rgba(139, 157, 195, 0.6);
            }
        }

        .envelope-title {
            font-size: 32px;
            font-weight: 700;
            color: #2c3e50;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            font-family: 'Playfair Display', 'Georgia', serif;
            margin-bottom: 8px;
            letter-spacing: 1px;
            position: relative;
            z-index: 3;
        }

        .envelope-subtitle {
            font-size: 18px;
            color: #5d6d7e;
            opacity: 0.9;
            font-style: italic;
            font-weight: 500;
            letter-spacing: 0.5px;
            position: relative;
            z-index: 3;
        }

        .envelope-body {
            flex: 1;
            padding: 40px 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            color: #2c3e50;
            position: relative;
            z-index: 3;
        }

        .open-button {
            background: linear-gradient(145deg, #d4a574 0%, #b8860b 100%);
            color: white;
            padding: 18px 50px;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 
                0 20px 40px rgba(212, 165, 116, 0.4),
                inset 0 2px 4px rgba(255,255,255,0.2);
            border: 3px solid rgba(255,255,255,0.3);
            margin-bottom: 25px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
        }

        .open-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
        }

        .open-button:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 
                0 25px 50px rgba(212, 165, 116, 0.6),
                inset 0 2px 4px rgba(255,255,255,0.2);
            background: linear-gradient(145deg, #b8860b 0%, #d4a574 100%);
        }

        .open-button:hover::before {
            left: 100%;
        }

        .envelope-footer {
            background: linear-gradient(145deg, #e6d5c3 0%, #d4c4b0 100%);
            padding: 20px;
            text-align: center;
            border-top: 2px solid #c4b5a0;
            position: relative;
            z-index: 3;
        }

        .invitation-preview {
            color: #5d6d7e;
            font-size: 16px;
            line-height: 1.6;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
        }

        .invitation-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #e9ecef 100%);
            border-radius: 25px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            overflow: visible;
            z-index: 1000;
            margin-top: 40px;
            box-shadow: 
                0 30px 60px rgba(0,0,0,0.15),
                0 15px 30px rgba(0,0,0,0.1),
                inset 0 1px 3px rgba(255,255,255,0.8);
            border: 3px solid #e9ecef;
            transform: translateY(100%) scale(0.9);
        }

        .invitation-content.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }

        .invitation-card {
            width: 100%;
            height: auto;
            background: transparent;
            border-radius: 25px;
            overflow: visible;
            text-align: center;
            position: relative;
            padding: 0;
        }

        .invitation-image {
            width: 100%;
            height: auto;
            max-height: 650px;
            object-fit: cover;
            border-radius: 25px 25px 0 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-bottom: 3px solid #f1f3f4;
        }

        .invitation-text-content {
            padding: 40px 50px 50px 50px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 0 0 25px 25px;
            position: relative;
        }

        .invitation-text-content::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background: linear-gradient(90deg, #d4a574, #b8860b, #d4a574);
            border-radius: 2px;
        }

        .invitation-title {
            font-size: 36px;
            color: #2c3e50;
            margin-bottom: 25px;
            font-weight: 700;
            line-height: 1.2;
            font-family: 'Playfair Display', 'Georgia', serif;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
            letter-spacing: 1px;
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .invitation-message {
            font-size: 18px;
            color: #5a6c7d;
            line-height: 1.8;
            margin-bottom: 35px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
            word-wrap: break-word;
            font-weight: 400;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
        }

        .rsvp-button {
            background: linear-gradient(135deg, #d4a574 0%, #b8860b 50%, #d4a574 100%);
            color: white;
            padding: 18px 50px;
            border: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 
                0 15px 35px rgba(212, 165, 116, 0.4),
                inset 0 2px 4px rgba(255,255,255,0.3);
            border: 3px solid rgba(255,255,255,0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            overflow: hidden;
        }

        .rsvp-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.6s ease;
        }

        .rsvp-button:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 
                0 20px 40px rgba(212, 165, 116, 0.6),
                inset 0 2px 4px rgba(255,255,255,0.3);
            background: linear-gradient(135deg, #b8860b 0%, #d4a574 50%, #b8860b 100%);
        }

        .rsvp-button:hover::before {
            left: 100%;
        }

        .close-button {
            position: absolute;
            top: 25px;
            right: 25px;
            background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%);
            color: #6c757d;
            border: 2px solid #e9ecef;
            border-radius: 50%;
            width: 55px;
            height: 55px;
            font-size: 28px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 10;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }

        .close-button:hover {
            background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,249,250,1) 100%);
            color: #495057;
            transform: scale(1.1) rotate(90deg);
            box-shadow: 0 12px 25px rgba(0,0,0,0.15);
            border-color: #d4a574;
        }

        .invitation-decoration {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 24px;
            opacity: 0.7;
            color: #d4a574;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .invitation-decoration.right {
            left: auto;
            right: 20px;
        }

        /* Add decorative corner elements */
        .invitation-card::before,
        .invitation-card::after {
            content: '';
            position: absolute;
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #d4a574 0%, #b8860b 100%);
            border-radius: 50%;
            opacity: 0.1;
            z-index: 1;
        }

        .invitation-card::before {
            top: 20px;
            left: 20px;
        }

        .invitation-card::after {
            bottom: 20px;
            right: 20px;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            .envelope-container {
                max-width: 95%;
                margin: 10px auto;
            }
            
            .envelope {
                height: 400px;
                border-radius: 20px;
            }
            
            .envelope-header {
                padding: 20px 15px 10px 15px;
            }
            
            .envelope-seal {
                width: 70px;
                height: 70px;
                font-size: 28px;
                margin-bottom: 15px;
            }
            
            .envelope-title {
                font-size: 28px;
            }
            
            .envelope-subtitle {
                font-size: 16px;
            }
            
            .envelope-body {
                padding: 30px 20px;
            }
            
            .open-button {
                padding: 15px 40px;
                font-size: 16px;
                margin-bottom: 20px;
            }
            
            .envelope-footer {
                padding: 15px;
            }
            
            .invitation-content {
                margin-top: 35px;
                border-radius: 20px;
            }
            
            .invitation-card {
                border-radius: 20px;
            }
            
            .invitation-image {
                max-height: 550px;
                border-radius: 20px 20px 0 0;
            }
            
            .invitation-text-content {
                padding: 30px 35px 40px 35px;
                border-radius: 0 0 20px 20px;
            }
            
            .invitation-title {
                font-size: 30px;
                margin-bottom: 20px;
            }
            
            .invitation-message {
                font-size: 16px;
                max-width: 100%;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            
            .rsvp-button {
                padding: 15px 40px;
                font-size: 16px;
            }
        }

        @media (max-width: 480px) {
            .envelope {
                height: 350px;
                border-radius: 18px;
            }
            
            .envelope-header {
                padding: 15px 12px 8px 12px;
            }
            
            .envelope-seal {
                width: 60px;
                height: 60px;
                font-size: 24px;
                margin-bottom: 12px;
            }
            
            .envelope-title {
                font-size: 24px;
            }
            
            .envelope-subtitle {
                font-size: 14px;
            }
            
            .envelope-body {
                padding: 25px 15px;
            }
            
            .open-button {
                padding: 12px 35px;
                font-size: 14px;
                margin-bottom: 18px;
            }
            
            .envelope-footer {
                padding: 12px;
            }
            
            .invitation-content {
                margin-top: 30px;
                border-radius: 18px;
            }
            
            .invitation-card {
                border-radius: 18px;
            }
            
            .invitation-image {
                max-height: 450px;
                border-radius: 18px 18px 0 0;
            }
            
            .invitation-text-content {
                padding: 25px 25px 35px 25px;
                border-radius: 0 0 18px 18px;
            }
            
            .invitation-title {
                font-size: 26px;
                margin-bottom: 18px;
            }
            
            .invitation-message {
                font-size: 15px;
                max-width: 100%;
                margin-bottom: 25px;
                line-height: 1.6;
            }
            
            .rsvp-button {
                padding: 12px 35px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="envelope-container">
        <!-- Envelope -->
        <div class="envelope" id="envelope">
            <div class="envelope-header">
                <div class="envelope-seal">✨</div>
                <h1 class="envelope-title">Wedding Invitation</h1>
                <p class="envelope-subtitle">A special invitation awaits you</p>
            </div>
            
            <div class="envelope-body">
                <button class="open-button" onclick="openInvitation()">Open Invitation Now</button>
            </div>
            
            <div class="envelope-footer">
                <div class="invitation-preview">
                    <strong>${invitation.title}</strong><br>
                    ${invitation.message ? invitation.message.substring(0, 100) + '...' : 'Click to view the full invitation'}
                </div>
            </div>
        </div>
        
        <!-- Invitation Content (Hidden initially) -->
        <div class="invitation-content" id="invitationContent">
            <div class="invitation-card">
                <button class="close-button" onclick="closeInvitation()">×</button>
                ${imageUrl ? `<img src="${imageUrl}" alt="Wedding Invitation" class="invitation-image">` : ''}
                <div class="invitation-text-content">
                    <h1 class="invitation-title">${invitation.title}</h1>
                    <p class="invitation-message">${invitation.message}</p>
                    <a href="${invitation.formUrl}" class="rsvp-button">${invitation.buttonText}</a>
                </div>
            </div>
        </div>
    </div>

    <script>
        function openInvitation() {
            const envelope = document.getElementById('envelope');
            const invitationContent = document.getElementById('invitationContent');
            
            // First, animate the envelope opening (flap lifting)
            envelope.classList.add('open');
            
            // After envelope opens, slide out the invitation
            setTimeout(() => {
                invitationContent.classList.add('show');
            }, 400); // Half of the envelope animation time
        }

        function closeInvitation() {
            const envelope = document.getElementById('envelope');
            const invitationContent = document.getElementById('invitationContent');
            
            // First hide the invitation
            invitationContent.classList.remove('show');
            
            // Then close the envelope
            setTimeout(() => {
                envelope.classList.remove('open');
            }, 300); // Wait for invitation to slide back
        }

        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            const envelope = document.getElementById('envelope');
            
            // Add hover sound effect (optional)
            envelope.addEventListener('mouseenter', function() {
                // You could add a subtle sound here
            });
            
            // Add click sound effect (optional)
            envelope.addEventListener('click', function() {
                // You could add a paper rustling sound here
            });
        });
    </script>
</body>
</html>`;
    }
}