import { Body, Controller, Get, HttpException, HttpStatus, Post, Logger, UseGuards } from '@nestjs/common';
import { GuestGroupsService } from './guest-groups.service';
import { CreateGuestGroupDto } from './dto/create-guest-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('guest-groups')
export class GuestGroupsController {
    private readonly logger = new Logger(GuestGroupsController.name);

    constructor(private readonly guestGroupsService: GuestGroupsService) { }

    @Get()
    async findAll() {
        this.logger.log('Received request to fetch all guest groups');
        try {
            const groups = await this.guestGroupsService.findAll();
            this.logger.log(`Found ${groups.length} guest groups:`, groups.map(g => ({ id: g.id, name: g.name })));
            return groups;
        } catch (error) {
            this.logger.error('Failed to fetch guest groups:', error);
            throw error;
        }
    }

    @Get('test')
    async test() {
        this.logger.log('Testing guest groups endpoint');
        try {
            const count = await this.prisma.guestGroup.count();
            const groups = await this.prisma.guestGroup.findMany();
            return {
                message: 'Guest groups test endpoint',
                count,
                groups: groups.map(g => ({ id: g.id, name: g.name })),
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            this.logger.error('Test endpoint error:', error);
            return { error: error.message, timestamp: new Date().toISOString() };
        }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() createGuestGroupDto: CreateGuestGroupDto) {
        this.logger.log(`Received request to create guest group: ${createGuestGroupDto.name}`);
        try {
            const result = await this.guestGroupsService.create(createGuestGroupDto.name.trim());
            this.logger.log(`Guest group created successfully: ${result.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to create guest group:', error);
            throw new HttpException('Failed to create group', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 