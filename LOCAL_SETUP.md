# 🏠 Local Database Setup Guide

This guide will help you set up your database locally, populate it with data, and then deploy it to Railway.

## 🚀 Quick Start

### 1. Set Up Local PostgreSQL Database

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL container
docker run --name wedding-rsvp-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=wedding_rsvp_local \
  -p 5432:5432 \
  -d postgres:15

# Check if it's running
docker ps
```

**Option B: Local PostgreSQL Installation**
- Install PostgreSQL on your machine
- Create a database named `wedding_rsvp_local`
- Update `env.local` with your credentials

### 2. Configure Environment

Copy `env.local` and update the database credentials:
```bash
cp env.local .env.local
# Edit .env.local with your database details
```

### 3. Run Local Setup

```bash
# Set up local database, run migrations, and seed data
npm run setup:local
```

This will:
- ✅ Generate Prisma client
- ✅ Create database tables
- ✅ Seed with initial data
- ✅ Open Prisma Studio for verification

### 4. Test Locally

```bash
# Start your backend
npm run start:dev

# Test endpoints
curl http://localhost:3001/api/health
```

## 🚂 Deploy to Railway

### 1. Export Local Database

```bash
# Create migration from your local database
npm run export:railway
```

### 2. Deploy to Railway

```bash
# Commit and push changes
git add .
git commit -m "Add local database setup and export scripts"
git push origin main
```

Railway will automatically:
- ✅ Run `npx prisma migrate deploy`
- ✅ Run `npx prisma db seed`
- ✅ Start your application

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U postgres -d wedding_rsvp_local
```

### Migration Issues
```bash
# Reset local database
npx prisma migrate reset

# Re-run setup
npm run setup:local
```

### Railway Issues
```bash
# Check Railway logs
railway logs

# Manual migration on Railway
railway run npx prisma migrate deploy
```

## 📊 Database Schema

Your database will include:
- **Users**: Admin accounts
- **Guests**: RSVP responses
- **Invitations**: Wedding invitations
- **QR Codes**: Guest check-in codes
- **Guest Groups**: Family/group organization
- **Logs**: Scan and email tracking

## 🎯 Benefits of This Approach

1. **Local Control**: Test everything locally first
2. **No Copy Script Issues**: Direct database operations
3. **Faster Development**: No waiting for Railway deployments
4. **Better Debugging**: See exactly what's happening
5. **Reliable Deployment**: Migrations work the same way everywhere

## 🚨 Important Notes

- **Never commit `.env.local`** (it's in .gitignore)
- **Update Railway environment variables** with production values
- **Test migrations locally** before deploying
- **Backup your local data** before major changes

## 🎉 Success Indicators

✅ Local database accessible at http://localhost:5555
✅ Backend running at http://localhost:3001
✅ Health endpoint returns 200 OK
✅ Admin user created in database
✅ Railway deployment completes without errors
✅ Production database populated with data
