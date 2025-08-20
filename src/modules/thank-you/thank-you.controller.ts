import { Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ThankYouService } from './thank-you.service';

@Controller('thank-you')
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