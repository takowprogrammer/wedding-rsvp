import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

    @Get('test')
    async test(@Res() res: Response) {
        console.log('=== TEST ENDPOINT CALLED ===');
        console.log('Method:', 'GET');
        console.log('URL:', '/api/auth/test');
        console.log('Headers:', JSON.stringify(res.req.headers, null, 2));
        
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        
        return res.status(HttpStatus.OK).json({
            message: 'Auth endpoint is working',
            timestamp: new Date().toISOString(),
            headers: res.req.headers
        });
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        try {
            console.log('=== LOGIN REQUEST RECEIVED ===');
            console.log('Method:', 'POST');
            console.log('URL:', '/api/auth/login');
            console.log('Headers:', JSON.stringify(res.req.headers, null, 2));
            console.log('Body:', JSON.stringify(loginUserDto, null, 2));
            console.log('Origin:', res.req.headers.origin || 'No origin');
            console.log('User-Agent:', res.req.headers['user-agent'] || 'No user-agent');
            
            const result = await this.authService.login(loginUserDto);
            
            // Set CORS headers explicitly
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
            res.header('Access-Control-Allow-Credentials', 'true');
            
            console.log('=== LOGIN SUCCESS ===');
            console.log('User:', loginUserDto.username);
            console.log('Response Status:', HttpStatus.OK);
            console.log('Response Headers:', JSON.stringify(res.getHeaders(), null, 2));
            console.log('Response Body:', JSON.stringify(result, null, 2));
            
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.error('=== LOGIN FAILED ===');
            console.error('User:', loginUserDto.username);
            console.error('Error:', error.message);
            console.error('Stack:', error.stack);
            
            // Set CORS headers even for errors
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
            res.header('Access-Control-Allow-Credentials', 'true');
            
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: error.message || 'Login failed'
            });
        }
    }
} 