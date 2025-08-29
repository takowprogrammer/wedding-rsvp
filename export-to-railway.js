const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Exporting local database to Railway...\n');

try {
  // Step 1: Create a migration from current state
  console.log('📦 Step 1: Creating migration from current database state...');
  execSync('npx prisma migrate dev --name export_to_railway', { stdio: 'inherit' });
  console.log('✅ Migration created\n');
  
  // Step 2: Generate Prisma client
  console.log('🔧 Step 2: Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');
  
  // Step 3: Show what will be deployed
  console.log('📋 Step 3: Migration files to deploy:');
  const migrationsDir = path.join(__dirname, 'prisma', 'migrations');
  const migrations = fs.readdirSync(migrationsDir)
    .filter(dir => fs.statSync(path.join(migrationsDir, dir)).isDirectory())
    .sort();
  
  migrations.forEach(migration => {
    console.log(`   📁 ${migration}`);
  });
  
  console.log('\n🎯 Next steps:');
  console.log('1. Commit and push these migration files to GitHub');
  console.log('2. Railway will automatically run: npx prisma migrate deploy');
  console.log('3. Railway will automatically run: npx prisma db seed');
  console.log('4. Your database will be populated on Railway!');
  
  console.log('\n💡 Pro tip: You can also manually deploy migrations to Railway:');
  console.log('   npx prisma migrate deploy --schema=./prisma/schema.prisma');
  
} catch (error) {
  console.error('\n❌ Error during export:', error.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Make sure your local database is running and accessible');
  console.log('2. Check that env.local has the correct DATABASE_URL');
  console.log('3. Ensure all dependencies are installed: npm install');
  process.exit(1);
}
