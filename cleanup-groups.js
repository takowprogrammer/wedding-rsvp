const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupGroups() {
    try {
        console.log('Starting group cleanup...');

        // Define group mappings
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
            'Family': 'Extended Family'
        };

        // Get all groups
        const allGroups = await prisma.guestGroup.findMany();
        console.log(`Found ${allGroups.length} groups`);

        const consolidatedGroups = {};

        // Group by new names
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

        console.log('Consolidated groups:', Object.keys(consolidatedGroups));

        // Update groups to consolidated names (only if name is different)
        for (const [newName, data] of Object.entries(consolidatedGroups)) {
            if (data.originalGroups[0] !== newName) {
                console.log(`Updating group ${data.id} from "${data.originalGroups[0]}" to "${newName}"`);
                try {
                    await prisma.guestGroup.update({
                        where: { id: data.id },
                        data: { name: newName }
                    });
                } catch (error) {
                    if (error.code === 'P2002') {
                        console.log(`Group "${newName}" already exists, skipping update`);
                    } else {
                        throw error;
                    }
                }
            }
        }

        // Delete duplicate groups
        for (const [newName, data] of Object.entries(consolidatedGroups)) {
            if (data.originalGroups.length > 1) {
                const groupsToDelete = allGroups.filter(g =>
                    data.originalGroups.includes(g.name) && g.id !== data.id
                );

                for (const groupToDelete of groupsToDelete) {
                    console.log(`Moving guests from "${groupToDelete.name}" to "${newName}"`);

                    // Move guests to consolidated group
                    await prisma.guest.updateMany({
                        where: { groupId: groupToDelete.id },
                        data: { groupId: data.id }
                    });

                    // Delete duplicate group
                    await prisma.guestGroup.delete({
                        where: { id: groupToDelete.id }
                    });

                    console.log(`Deleted group "${groupToDelete.name}"`);
                }
            }
        }

        // Get final count
        const finalGroups = await prisma.guestGroup.findMany();
        console.log(`Cleanup complete! Final group count: ${finalGroups.length}`);
        console.log('Final groups:', finalGroups.map(g => g.name));

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupGroups();
