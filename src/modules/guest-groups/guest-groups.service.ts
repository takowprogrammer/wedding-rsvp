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
        const defaultGroups = [
            // Family categories
            'Family of the Bride',
            'Family of the Groom',
            'Extended Family - Bride',
            'Extended Family - Groom',
            
            // Friends categories
            'Friends of the Bride',
            'Friends of the Groom',
            'Mutual Friends',
            'College Friends',
            'High School Friends',
            
            // Work/Professional categories
            'Colleagues of the Bride',
            'Colleagues of the Groom',
            'Business Associates',
            
            // Educational categories
            'Classmates of the Bride',
            'Classmates of the Groom',
            'University Alumni',
            
            // Other categories
            'Neighbors',
            'Family Friends',
            'Religious Community',
            'Sports/Activity Groups'
        ];
        
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
            message: 'Comprehensive wedding guest groups seeded',
            created: createdGroups.length,
            total: await this.prisma.guestGroup.count(),
            groups: defaultGroups
        };
    }
} 