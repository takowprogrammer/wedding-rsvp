import { GuestGroupsService } from './guest-groups.service';
import { CreateGuestGroupDto } from './dto/create-guest-group.dto';
export declare class GuestGroupsController {
    private readonly guestGroupsService;
    private readonly logger;
    constructor(guestGroupsService: GuestGroupsService);
    findAll(): Promise<{
        id: string;
        name: string;
    }[]>;
    create(createGuestGroupDto: CreateGuestGroupDto): Promise<{
        id: string;
        name: string;
    }>;
}
