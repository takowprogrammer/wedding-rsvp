import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, Query, Logger, Res, Delete, UseGuards } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Response } from 'express';
import * as QRCode from 'qrcode';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('guests')
@UseGuards(JwtAuthGuard)
export class GuestsController {
    private readonly logger = new Logger(GuestsController.name);

    constructor(private readonly guestsService: GuestsService) { }

    @Post()
    async create(@Body() createGuestDto: CreateGuestDto) {
        this.logger.log(`Received guest creation request for: ${createGuestDto.firstName} ${createGuestDto.lastName}`);
        this.logger.debug('Request body:', JSON.stringify(createGuestDto, null, 2));

        try {
            const result = await this.guestsService.create(createGuestDto);
            this.logger.log(`Guest created successfully: ${result.guest.id}`);
            return result;
        } catch (error) {
            this.logger.error('Failed to create guest:', error);
            throw error;
        }
    }

    @Post('create')
    async createWithQRCode(@Body() body: { name: string; email: string; phone: string }, @Res() res: Response) {
        try {
            // Map `name` to `firstName` and `lastName` (split by space or default to empty strings)
            const [firstName, lastName] = body.name.split(' ') || ['', ''];

            const createGuestDto: CreateGuestDto = {
                firstName,
                lastName,
                email: body.email,
                phone: body.phone, // Include phone field
                numberOfGuests: 1, // Default value, adjust as needed
            };

            // Create guest
            const guest = await this.guestsService.create(createGuestDto);

            // Ensure guest creation was successful before generating QR code
            if (!guest) {
                throw new Error('Guest creation failed.');
            }

            // Generate QR code and alphanumeric code only if guest creation succeeds
            const alphanumericCode = Math.random().toString(36).substring(2, 10).toUpperCase();
            const qrCodeData = await QRCode.toDataURL(alphanumericCode);

            // Respond with QR code and alphanumeric code
            res.status(HttpStatus.CREATED).json({
                message: 'Guest created successfully. Please keep the code safe.',
                guest,
                qrCode: qrCodeData,
                alphanumericCode,
            });
        } catch (error) {
            console.error('[GuestsController] Failed to create guest:', error.message);
            res.status(HttpStatus.BAD_REQUEST).json({
                message: error.message,
            });
        }
    }

    @Get()
    async findAll() {
        return await this.guestsService.findAll();
    }

    @Get('admin')
    async findAllAdmin(
        @Query('groupId') groupId?: string,
        @Query('search') search?: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        console.log('Finding all admin guests...');
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const result = await this.guestsService.findAllAdmin(groupId, search, pageNumber, limitNumber);
        console.log('Guests found:', result.guests.length);
        return result;
    }

    @Get('stats')
    async getStats() {
        return await this.guestsService.getStats();
    }

    @Get('stats/extended')
    async getExtendedStats(@Query('eventDate') eventDate?: string) {
        return await this.guestsService.getExtendedStats(eventDate);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const guest = await this.guestsService.findOne(id);
        if (!guest) {
            throw new HttpException('Guest not found', HttpStatus.NOT_FOUND);
        }
        return guest;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.guestsService.remove(id);
    }

    @Get('all')
    async findAllUnpaginated() {
        return await this.guestsService.findAllUnpaginated();
    }
}