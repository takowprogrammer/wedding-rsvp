import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GuestGroupsService {
    constructor(private prisma: PrismaService) { }

    async create(name: string) {
        return await this.prisma.guestGroup.create({ data: { name } });
    }

    async findAll() {
        return await this.prisma.guestGroup.findMany({
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string) {
        return await this.prisma.guestGroup.findUnique({ where: { id } });
    }
} 