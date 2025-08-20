import { Controller, Get, Post, Body, Param, Res, HttpException, HttpStatus, Delete, Logger } from '@nestjs/common';
import { Response } from 'express';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import * as fs from 'fs';
import * as path from 'path';

@Controller('invitations')
export class InvitationsController {
    private readonly logger = new Logger(InvitationsController.name);

    constructor(private readonly invitationsService: InvitationsService) { }

    @Post()
    async create(@Body() createInvitationDto: CreateInvitationDto) {
        this.logger.log(`Received invitation creation request: ${createInvitationDto.title}`);
        this.logger.debug('Invitation data:', JSON.stringify(createInvitationDto, null, 2));

        try {
            const result = await this.invitationsService.create(createInvitationDto);
            this.logger.log(`Invitation created successfully: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to create invitation:', error);
            throw error;
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.invitationsService.remove(id);
    }

    @Get()
    async findAll() {
        return await this.invitationsService.findAll();
    }

    @Get('active')
    async findActive() {
        return await this.invitationsService.findActive();
    }

    @Get('templates')
    async listTemplates() {
        // scan frontend/public/invitations first, then fallback to public/invitations
        const candidates = [
            path.join(process.cwd(), 'frontend', 'public', 'invitations'),
            path.join(process.cwd(), 'public', 'invitations'),
        ];
        for (const dir of candidates) {
            try {
                const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.png'));
                if (files.length > 0) {
                    return files.map(f => ({
                        file: f,
                        templateName: path.parse(f).name,
                        imageUrl: `/invitations/${f}`,
                    }));
                }
            } catch { }
        }
        return [];
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const invitation = await this.invitationsService.findOne(id);
        if (!invitation) {
            throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
        }
        return invitation;
    }

    @Get(':id/preview')
    async previewInvitation(@Param('id') id: string, @Res() res: Response) {
        try {
            const html = await this.invitationsService.generateInvitationHtml(id);
            res.setHeader('Content-Type', 'text/html');
            res.send(html);
        } catch (error) {
            throw new HttpException('Invitation not found', HttpStatus.NOT_FOUND);
        }
    }
}