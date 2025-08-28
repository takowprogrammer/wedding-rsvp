# Railway Deployment Guide

## Prerequisites

1. Ensure your Railway project has a PostgreSQL database provisioned
2. Set the `DATABASE_URL` environment variable in Railway dashboard
3. Make sure the database is accessible from your application

## Environment Variables

Set these in your Railway dashboard:

```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
PORT=8080
```

## Build Process

The application now uses a custom build script for Railway:

```bash
npm run build:railway
```

This script:
1. Generates the Prisma client (`prisma generate`)
2. Builds the NestJS application (`nest build`)

## Health Checks

After deployment, you can check the application health:

- **General Health**: `https://your-app.railway.app/api/health`
- **Database Health**: `https://your-app.railway.app/api/health/db`

## Common Issues & Solutions

### 1. Database Connection Error

**Error**: `Can't reach database server at postgres-6a-u.railway.internal:5432`

**Solutions**:
- Verify `DATABASE_URL` is set correctly in Railway dashboard
- Ensure the database service is running
- Check if the database is accessible from your app service

### 2. Prisma Client Not Generated

**Error**: `You may have to run prisma generate for your changes to take effect`

**Solutions**:
- The build script now automatically runs `prisma generate`
- Ensure you're using `npm run build:railway` for Railway deployments

### 3. Environment Variables Not Loading

**Solutions**:
- Verify all environment variables are set in Railway dashboard
- Check that `NODE_ENV=production` is set
- Ensure no typos in variable names

## Debugging

1. **Check Logs**: Use Railway's log viewer to see application logs
2. **Health Endpoints**: Use the health check endpoints to verify database connectivity
3. **Environment**: Verify all environment variables are properly set

## Railway Configuration

The `railway.toml` file configures:
- Build command: `npm run build:railway`
- Start command: `npm run start:prod`
- Health check path: `/api/health`
- Restart policy on failures

## Database Migration

If you need to run migrations:

```bash
npx prisma migrate deploy
```

**Note**: This should be run in the Railway environment, not locally.
