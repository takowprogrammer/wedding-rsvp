import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating test guest groups...');

    // Create test guest groups
    const group1 = await prisma.guestGroup.upsert({
        where: { name: 'Family' },
        update: {},
        create: { name: 'Family' },
    });

    const group2 = await prisma.guestGroup.upsert({
        where: { name: 'Friends' },
        update: {},
        create: { name: 'Friends' },
    });

    const group3 = await prisma.guestGroup.upsert({
        where: { name: 'Colleagues' },
        update: {},
        create: { name: 'Colleagues' },
    });

    console.log('Creating test guests...');

    // Create test guests with different names for search testing
    const testGuests = [
        { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '555-0101', groupId: group1.id },
        { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', phone: '555-0102', groupId: group1.id },
        { firstName: 'Mike', lastName: 'Johnson', email: 'mike.johnson@example.com', phone: '555-0103', groupId: group2.id },
        { firstName: 'Sarah', lastName: 'Williams', email: 'sarah.williams@example.com', phone: '555-0104', groupId: group2.id },
        { firstName: 'David', lastName: 'Brown', email: 'david.brown@example.com', phone: '555-0105', groupId: group3.id },
        { firstName: 'Lisa', lastName: 'Davis', email: 'lisa.davis@example.com', phone: '555-0106', groupId: group3.id },
        { firstName: 'Robert', lastName: 'Miller', email: 'robert.miller@example.com', phone: '555-0107', groupId: group1.id },
        { firstName: 'Emily', lastName: 'Wilson', email: 'emily.wilson@example.com', phone: '555-0108', groupId: group2.id },
        { firstName: 'Michael', lastName: 'Taylor', email: 'michael.taylor@example.com', phone: '555-0109', groupId: group3.id },
        { firstName: 'Jessica', lastName: 'Anderson', email: 'jessica.anderson@example.com', phone: '555-0110', groupId: group1.id },
        { firstName: 'Christopher', lastName: 'Thomas', email: 'christopher.thomas@example.com', phone: '555-0111', groupId: group2.id },
        { firstName: 'Amanda', lastName: 'Jackson', email: 'amanda.jackson@example.com', phone: '555-0112', groupId: group3.id },
    ];

    for (const guestData of testGuests) {
        await prisma.guest.upsert({
            where: { email: guestData.email },
            update: {},
            create: {
                ...guestData,
                numberOfGuests: Math.floor(Math.random() * 3) + 1,
                status: 'CONFIRMED',
                checkedIn: Math.random() > 0.7, // 30% chance of being checked in
            },
        });
    }

    console.log('Test data created successfully!');
    console.log(`Created ${testGuests.length} test guests across 3 groups`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


