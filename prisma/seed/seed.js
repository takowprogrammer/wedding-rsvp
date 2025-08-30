const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists, skipping...');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });

    console.log('✅ Admin user created:', adminUser.username);

    // Create a sample invitation template
    const existingInvitation = await prisma.invitation.findFirst({
      where: { templateName: 'Default Wedding Invitation' }
    });

    if (!existingInvitation) {
      const invitation = await prisma.invitation.create({
        data: {
          templateName: 'Default Wedding Invitation',
          title: 'You\'re Invited to Our Wedding',
          message: 'We would be honored to have you join us on our special day.',
          buttonText: 'RSVP Now',
          isActive: true,
        },
      });
      console.log('✅ Default invitation template created');
    }

    // Create sample guest groups
    const existingGroups = await prisma.guestGroup.findMany();

    if (existingGroups.length === 0) {
      const groups = await Promise.all([
        prisma.guestGroup.create({
          data: { name: 'Family' }
        }),
        prisma.guestGroup.create({
          data: { name: 'Friends' }
        }),
        prisma.guestGroup.create({
          data: { name: 'Colleagues' }
        }),
        prisma.guestGroup.create({
          data: { name: 'Extended Family' }
        })
      ]);
      console.log('✅ Sample guest groups created:', groups.map(g => g.name));
    } else {
      console.log('✅ Guest groups already exist:', existingGroups.map(g => g.name));
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📝 Default credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    // Don't throw error, just log it and continue
    console.log('⚠️ Seeding failed, but continuing with app startup...');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    // Don't exit, just log the error
    console.log('⚠️ Seeding failed, but continuing with app startup...');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
