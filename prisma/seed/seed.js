const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const username = 'admin'; // Placeholder username
    const password = 'password'; // Placeholder password

    console.log(`Creating admin user with username: ${username}`);

    try {
        // Check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            console.log('Admin user already exists, skipping creation');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const adminUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        console.log('Admin user created successfully:');
        console.log(adminUser);
    } catch (error) {
        console.error('Error creating admin user:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Seed script failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
