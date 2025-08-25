import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    validateUser(username: string, password: string): Promise<User | null>;
}
