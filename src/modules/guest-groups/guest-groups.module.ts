import { Module } from '@nestjs/common';
import { GuestGroupsService } from './guest-groups.service';
import { GuestGroupsController } from './guest-groups.controller';

@Module({
    controllers: [GuestGroupsController],
    providers: [GuestGroupsService],
    exports: [GuestGroupsService],
})
export class GuestGroupsModule { } 