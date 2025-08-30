const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function deployGroups() {
    console.log('🚀 Deploying comprehensive guest groups to production...');

    const allGroups = [
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

    try {
        await prisma.$connect();
        console.log('✅ Database connected');

        let created = 0;
        let skipped = 0;

        for (const groupName of allGroups) {
            const existing = await prisma.guestGroup.findFirst({
                where: { name: groupName }
            });

            if (!existing) {
                await prisma.guestGroup.create({
                    data: { name: groupName }
                });
                console.log(`✅ Created: ${groupName}`);
                created++;
            } else {
                console.log(`⏭️  Skipped: ${groupName} (already exists)`);
                skipped++;
            }
        }

        const totalGroups = await prisma.guestGroup.count();
        console.log(`\n🎉 Deployment Summary:`);
        console.log(`   • Created: ${created} new groups`);
        console.log(`   • Skipped: ${skipped} existing groups`);
        console.log(`   • Total: ${totalGroups} guest groups`);

        if (totalGroups >= 20) {
            console.log(`\n✅ SUCCESS! Your frontend should now display all guest groups!`);
        } else {
            console.log(`\n⚠️  WARNING: Only ${totalGroups} groups found. Frontend may still be limited.`);
        }

    } catch (error) {
        console.error('❌ Error during deployment:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            meta: error.meta
        });
    } finally {
        await prisma.$disconnect();
        console.log('\n🔌 Database disconnected');
    }
}

deployGroups();
