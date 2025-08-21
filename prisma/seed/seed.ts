import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const username = 'admin'; // Placeholder username
    const password = 'password'; // Placeholder password

    console.log(`Creating admin user with username: ${username}`);

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    console.log('Admin user created successfully:');
    console.log(adminUser);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
