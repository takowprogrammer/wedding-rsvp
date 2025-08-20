import { OnModuleInit } from '@nestjs/common';
import { ThankYouService } from './modules/thank-you/thank-you.service';
export declare class AppModule implements OnModuleInit {
    private readonly thankYouService;
    constructor(thankYouService: ThankYouService);
    onModuleInit(): Promise<void>;
}
