import { Module } from '@nestjs/common';
import { ThankYouService } from './thank-you.service';
import { ThankYouController } from './thank-you.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [PrismaModule, MailerModule],
    controllers: [ThankYouController],
    providers: [ThankYouService],
    exports: [ThankYouService],
})
export class ThankYouModule { } 