const fs = require('fs');
const path = require('path');

console.log('📁 Copying prisma directory to dist...');

const sourceDir = path.join(__dirname, 'prisma');
const targetDir = path.join(__dirname, 'dist', 'prisma');

try {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log('✅ Created target directory:', targetDir);
    }

    // Copy prisma directory recursively
    function copyDir(src, dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);

            if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
                console.log(`📄 Copied: ${entry.name}`);
            }
        }
    }

    copyDir(sourceDir, targetDir);
    console.log('✅ Prisma directory copied successfully to dist/');
    
    // Verify the copy
    if (fs.existsSync(path.join(targetDir, 'seed', 'seed.ts'))) {
        console.log('✅ Seed file found in dist/prisma/seed/seed.ts');
    } else {
        console.log('❌ Seed file not found in dist/prisma/seed/seed.ts');
    }
    
} catch (error) {
    console.error('❌ Error copying prisma directory:', error);
    process.exit(1);
}
