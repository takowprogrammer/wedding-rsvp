import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(registerUserDto: RegisterUserDto): Promise<Omit<User, 'password'>> {
        const { username, password } = registerUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        const { password: _, ...result } = user;
        return result;
    }

    async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
        const { username, password } = loginUserDto;
        const user = await this.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { username } });
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
} 