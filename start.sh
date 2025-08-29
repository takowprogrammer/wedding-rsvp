#!/bin/bash

echo "🚀 Starting Wedding RSVP Backend..."

# Change to app directory
cd /app

echo "📁 Current directory: $(pwd)"
echo "📁 Contents: $(ls -la)"

# Check if prisma schema exists
if [ ! -f "./prisma/schema.prisma" ]; then
    echo "❌ Prisma schema not found at ./prisma/schema.prisma"
    echo "📁 Prisma directory contents: $(ls -la prisma/ 2>/dev/null || echo 'prisma directory not found')"
    exit 1
fi

echo "✅ Prisma schema found"

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

if [ $? -ne 0 ]; then
    echo "❌ Migration failed"
    exit 1
fi

echo "✅ Migrations completed"

# Run seed script
echo "🌱 Running seed script..."
npm run seed

if [ $? -ne 0 ]; then
    echo "❌ Seed failed"
    exit 1
fi

echo "✅ Seed completed"

# Start the application
echo "🚀 Starting NestJS application..."
node dist/main
