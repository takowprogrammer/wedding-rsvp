const fs = require('fs');
const path = require('path');

console.log('🔄 Starting Prisma directory copy...');
console.log('Current working directory:', process.cwd());

const sourceDir = './prisma';
const targetDir = './dist/prisma';

try {
  // Check if source exists
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source directory ${sourceDir} does not exist`);
  }
  
  console.log('📁 Source directory exists:', sourceDir);
  console.log('📁 Target directory:', targetDir);
  
  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('✅ Created target directory');
  }
  
  // Copy schema.prisma
  const schemaSource = path.join(sourceDir, 'schema.prisma');
  const schemaTarget = path.join(targetDir, 'schema.prisma');
  
  if (fs.existsSync(schemaSource)) {
    fs.copyFileSync(schemaSource, schemaTarget);
    console.log('✅ Copied schema.prisma');
  } else {
    throw new Error('schema.prisma not found in source');
  }
  
  // Copy migrations directory
  const migrationsSource = path.join(sourceDir, 'migrations');
  const migrationsTarget = path.join(targetDir, 'migrations');
  
  if (fs.existsSync(migrationsSource)) {
    // Copy entire migrations directory recursively
    copyDirRecursive(migrationsSource, migrationsTarget);
    console.log('✅ Copied migrations directory');
  } else {
    throw new Error('migrations directory not found in source');
  }
  
  // Copy seed directory
  const seedSource = path.join(sourceDir, 'seed');
  const seedTarget = path.join(targetDir, 'seed');
  
  if (fs.existsSync(seedSource)) {
    copyDirRecursive(seedSource, seedTarget);
    console.log('✅ Copied seed directory');
  } else {
    throw new Error('seed directory not found in source');
  }
  
  // Verify the copy
  console.log('🔍 Verifying copy...');
  const targetSchema = path.join(targetDir, 'schema.prisma');
  const targetMigrations = path.join(targetDir, 'migrations');
  const targetSeed = path.join(targetDir, 'seed');
  
  if (fs.existsSync(targetSchema) && fs.existsSync(targetMigrations) && fs.existsSync(targetSeed)) {
    console.log('✅ Prisma directory copy completed successfully!');
    console.log('📁 Target contents:', fs.readdirSync(targetDir));
  } else {
    throw new Error('Verification failed - target files missing');
  }
  
} catch (error) {
  console.error('❌ Error copying Prisma directory:', error.message);
  process.exit(1);
}

function copyDirRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
