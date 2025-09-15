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

    async cleanupDuplicateGroups() {
        // Define groups to consolidate
        const groupMappings = {
            'Family of the Bride': 'Bride\'s Family',
            'Family of Bride': 'Bride\'s Family',
            'Family of the Groom': 'Groom\'s Family',
            'Family of Groom': 'Groom\'s Family',
            'Extended Family - Bride': 'Extended Family',
            'Extended Family - Groom': 'Extended Family',
            'Friends of the Bride': 'Bride\'s Friends',
            'Friends of Bride': 'Bride\'s Friends',
            'Friends of the Groom': 'Groom\'s Friends',
            'Friends of Groom': 'Groom\'s Friends',
            'Colleagues of the Bride': 'Work Colleagues',
            'Colleagues of the Groom': 'Work Colleagues',
            'Colleagues': 'Work Colleagues',
            'Classmates of the Bride': 'University Alumni',
            'Classmates of the Groom': 'University Alumni',
            'Work Colleagues': 'Work Colleagues'
        };

        const consolidatedGroups: Record<string, { id: string; name: string; originalGroups: string[] }> = {};

        // Get all existing groups
        const allGroups = await this.prisma.guestGroup.findMany();
        
        for (const group of allGroups) {
            const newName = groupMappings[group.name] || group.name;
            
            if (!consolidatedGroups[newName]) {
                consolidatedGroups[newName] = {
                    id: group.id,
                    name: newName,
                    originalGroups: [group.name]
                };
            } else {
                consolidatedGroups[newName].originalGroups.push(group.name);
            }
        }

        // Update groups to consolidated names
        for (const [newName, data] of Object.entries(consolidatedGroups)) {
            if (data.originalGroups.length > 1 || data.originalGroups[0] !== newName) {
                await this.prisma.guestGroup.update({
                    where: { id: data.id },
                    data: { name: newName }
                });
            }
        }

        // Delete duplicate groups (keep the first one, delete others)
        for (const [newName, data] of Object.entries(consolidatedGroups)) {
            if (data.originalGroups.length > 1) {
                const groupsToDelete = allGroups.filter(g =>
                    data.originalGroups.includes(g.name) && g.id !== data.id
                );

                for (const groupToDelete of groupsToDelete) {
                    // First, move any guests from deleted group to the consolidated group
                    await this.prisma.guest.updateMany({
                        where: { groupId: groupToDelete.id },
                        data: { groupId: data.id }
                    });

                    // Then delete the duplicate group
                    await this.prisma.guestGroup.delete({
                        where: { id: groupToDelete.id }
                    });
                }
            }
        }

        return {
            message: 'Duplicate groups cleaned up and consolidated',
            consolidatedGroups: Object.keys(consolidatedGroups)
        };
    }

    async seedDefaultGroups() {
        const defaultGroups = [
            // Family categories
            'Bride\'s Family',
            'Groom\'s Family',
            'Extended Family',

            // Friends categories
            'Bride\'s Friends',
            'Groom\'s Friends',
            'Mutual Friends',
            'College Friends',
            'High School Friends',

            // Work/Professional categories
            'Work Colleagues',
            'Business Associates',

            // Educational categories
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