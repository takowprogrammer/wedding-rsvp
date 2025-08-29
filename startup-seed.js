const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function seedDatabase() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🌱 Starting database seeding process...');
        
        const username = 'admin';
        const password = 'password';

        console.log(`🔍 Checking if admin user exists: ${username}`);

        // Check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            console.log('✅ Admin user already exists, skipping creation');
            return;
        }

        console.log('🔐 Creating admin user...');
        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        console.log('✅ Admin user created successfully:');
        console.log('   ID:', adminUser.id);
        console.log('   Username:', adminUser.username);
        console.log('   Created:', adminUser.createdAt);
        
    } catch (error) {
        console.error('❌ Error during database seeding:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Export the function so it can be imported
module.exports = { seedDatabase };

// If run directly, execute the seeding
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('🎉 Database seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database seeding failed:', error);
            process.exit(1);
        });
}
