import { Controller, Post, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ThankYouService } from './thank-you.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('thank-you')
@UseGuards(JwtAuthGuard)
export class ThankYouController {
    constructor(private readonly thankYouService: ThankYouService) { }

    @Post('send')
    async send() {
        try {
            await this.thankYouService.sendThankYouEmailsForAttendees();
            return { success: true };
        } catch (error) {
            throw new HttpException('Failed to send thank-you emails', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
} 