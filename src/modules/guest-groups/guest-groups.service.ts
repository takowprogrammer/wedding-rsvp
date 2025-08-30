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

    async seedDefaultGroups() {
        const defaultGroups = ['Family', 'Friends', 'Colleagues', 'Extended Family'];
        const createdGroups = [];

        for (const groupName of defaultGroups) {
            const existingGroup = await this.prisma.guestGroup.findFirst({
                where: { name: groupName }
            });

            if (!existingGroup) {
                const newGroup = await this.prisma.guestGroup.create({
                    data: { name: groupName }
                });
                createdGroups.push(newGroup);
            }
        }

        return {
            message: 'Default groups seeded',
            created: createdGroups.length,
            total: await this.prisma.guestGroup.count()
        };
    }
} 