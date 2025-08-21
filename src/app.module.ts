import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuestsModule } from './modules/guests/guests.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { QrCodesModule } from './modules/qr-codes/qr-codes.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { GuestGroupsModule } from './modules/guest-groups/guest-groups.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ThankYouModule } from './modules/thank-you/thank-you.module';
import { ThankYouService } from './modules/thank-you/thank-you.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        GuestsModule,
        InvitationsModule,
        QrCodesModule,
        GuestGroupsModule,
        MailerModule,
        ThankYouModule,
        AuthModule,
    ],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly thankYouService: ThankYouService) { }

    async onModuleInit() {
        // check once on boot
        this.thankYouService.sendIfAfterWedding().catch(() => undefined);
        // check daily
        setInterval(() => {
            this.thankYouService.sendIfAfterWedding().catch(() => undefined);
        }, 24 * 60 * 60 * 1000);
    }
} 