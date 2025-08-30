const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Wait for database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists, skipping...');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          password: hashedPassword,
        },
      });

      console.log('✅ Admin user created:', adminUser.username);
    }

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
    } else {
      console.log('✅ Default invitation template already exists');
    }

    // Create sample guest groups
    const existingGroups = await prisma.guestGroup.findMany();
    
    if (existingGroups.length === 0) {
      console.log('📝 Creating sample guest groups...');
      
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
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    // Don't throw error, just log it and continue
    console.log('⚠️ Seeding failed, but continuing with app startup...');
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    // Don't exit, just log the error
    console.log('⚠️ Seeding failed, but continuing with app startup...');
    process.exit(0); // Exit gracefully
  });
