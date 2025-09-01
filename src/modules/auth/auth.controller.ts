import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
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

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        try {
            console.log('Login attempt for user:', loginUserDto.username);
            const result = await this.authService.login(loginUserDto);
            
            // Set CORS headers explicitly
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
            
            console.log('Login successful for user:', loginUserDto.username);
            return res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.error('Login failed for user:', loginUserDto.username, error.message);
            return res.status(HttpStatus.UNAUTHORIZED).json({
                message: error.message || 'Login failed'
            });
        }
    }
} 