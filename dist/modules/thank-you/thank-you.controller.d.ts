import { ThankYouService } from './thank-you.service';
export declare class ThankYouController {
    private readonly thankYouService;
    constructor(thankYouService: ThankYouService);
    send(): Promise<{
        success: boolean;
    }>;
}
