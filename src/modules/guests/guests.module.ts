import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsController } from './guests.controller';
import { QrCodesModule } from '../qr-codes/qr-codes.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
    imports: [QrCodesModule, MailerModule],
    controllers: [GuestsController],
    providers: [GuestsService],
    exports: [GuestsService],
})
export class GuestsModule { } 