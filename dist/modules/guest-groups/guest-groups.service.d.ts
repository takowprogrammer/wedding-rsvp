import { PrismaService } from '../prisma/prisma.service';
export declare class GuestGroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(name: string): Promise<{
        id: string;
        name: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
