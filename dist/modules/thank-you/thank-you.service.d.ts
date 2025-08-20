import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';
export declare class ThankYouService {
    private prisma;
    private mailer;
    private readonly logger;
    constructor(prisma: PrismaService, mailer: MailerService);
    private buildEmailHtml;
    sendThankYouEmailsForAttendees(): Promise<void>;
    sendIfAfterWedding(): Promise<void>;
}
