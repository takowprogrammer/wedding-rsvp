const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up local database for Wedding RSVP...\n');

// Check if .env.local exists
const envFile = path.join(__dirname, 'env.local');
if (!fs.existsSync(envFile)) {
  console.error('❌ env.local file not found! Please create it first.');
  console.log('📝 Copy the contents from env.local.example or create it manually.');
  process.exit(1);
}

try {
  // Load environment variables from env.local
  require('dotenv').config({ path: envFile });
  
  console.log('✅ Environment loaded from env.local');
  console.log(`📊 Database URL: ${process.env.DATABASE_URL}\n`);
  
  // Step 1: Generate Prisma client
  console.log('🔧 Step 1: Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');
  
  // Step 2: Push schema to database (creates tables)
  console.log('🗄️ Step 2: Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema created\n');
  
  // Step 3: Run seed script
  console.log('🌱 Step 3: Running seed script...');
  execSync('npx ts-node prisma/seed/seed.ts', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully\n');
  
  // Step 4: Verify setup
  console.log('🔍 Step 4: Verifying database setup...');
  execSync('npx prisma studio --port 5555', { stdio: 'inherit' });
  
  console.log('\n🎉 Local database setup completed successfully!');
  console.log('📊 You can now view your database at: http://localhost:5555');
  console.log('🚀 Your backend is ready to run with: npm run start:dev');
  
} catch (error) {
  console.error('\n❌ Error during setup:', error.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Make sure PostgreSQL is running on localhost:5432');
  console.log('2. Create a database named "wedding_rsvp_local"');
  console.log('3. Update env.local with correct database credentials');
  console.log('4. Install dependencies: npm install');
  process.exit(1);
}
