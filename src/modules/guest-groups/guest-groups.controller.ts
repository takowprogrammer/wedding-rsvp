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
            this.logger.log(`Found ${groups.length} guest groups`);
            return groups;
        } catch (error) {
            this.logger.error('Failed to fetch guest groups:', error);
            throw error;
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