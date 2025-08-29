const fs = require('fs');
const path = require('path');

console.log('📁 Starting prisma directory copy process...');
console.log('📁 Current working directory:', process.cwd());
console.log('📁 __dirname:', __dirname);

const sourceDir = path.join(__dirname, 'prisma');
const targetDir = path.join(__dirname, 'dist', 'prisma');

console.log('📁 Source directory:', sourceDir);
console.log('📁 Target directory:', targetDir);

// Check if source exists
if (!fs.existsSync(sourceDir)) {
    console.error('❌ Source directory does not exist:', sourceDir);
    console.log('📁 Available files in current directory:', fs.readdirSync(__dirname));
    process.exit(1);
}

console.log('✅ Source directory exists');
console.log('📁 Source directory contents:', fs.readdirSync(sourceDir));

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
    if (fs.existsSync(path.join(targetDir, 'seed', 'seed.js'))) {
        console.log('✅ Seed file found in dist/prisma/seed/seed.js');
    } else {
        console.log('❌ Seed file not found in dist/prisma/seed/seed.js');
        console.log('📁 Target directory contents:', fs.readdirSync(targetDir));
        if (fs.existsSync(path.join(targetDir, 'seed'))) {
            console.log('📁 Seed subdirectory contents:', fs.readdirSync(path.join(targetDir, 'seed')));
        }
    }
    
} catch (error) {
    console.error('❌ Error copying prisma directory:', error);
    process.exit(1);
}
