import { Controller, Get, HttpStatus, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  async check(@Res() res: Response) {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return res.status(HttpStatus.OK).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        environment: process.env.NODE_ENV || 'development',
        cors: 'enabled',
      });
    } catch (error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
        environment: process.env.NODE_ENV || 'development',
      });
    }
  }

  @Get('db')
  async databaseCheck(@Res() res: Response) {
    try {
      // Test database connection with more details
      const result = await this.prisma.$queryRaw`SELECT version() as version, current_database() as database, current_user as user`;

      return res.status(HttpStatus.OK).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        details: result[0],
        environment: process.env.NODE_ENV || 'development',
      });
    } catch (error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message,
        environment: process.env.NODE_ENV || 'development',
      });
    }
  }

  @Post('test')
  async testPost(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'POST request successful',
      environment: process.env.NODE_ENV || 'development',
      cors: 'enabled',
    });
  }

  @Get('cors')
  async corsTest(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'CORS test successful',
      environment: process.env.NODE_ENV || 'development',
      cors: 'enabled',
      allowedOrigins: process.env.NODE_ENV === 'production'
        ? ['https://rsvp-fe-lovat.vercel.app', process.env.FRONTEND_URL].filter(Boolean)
        : ['http://localhost:3000', 'http://localhost:3001'],
    });
  }

  @Get('ping')
  async ping(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Pong! Backend is reachable',
      environment: process.env.NODE_ENV || 'development',
      cors: 'enabled',
      requestHeaders: res.req.headers,
    });
  }

  @Post('echo')
  async echo(@Res() res: Response, @Body() body: any) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Echo endpoint working',
      receivedData: body,
      environment: process.env.NODE_ENV || 'development',
      cors: 'enabled',
    });
  }
}
