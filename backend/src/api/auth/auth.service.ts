import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { LoginDto } from './login.dto';
import { Response, Request, CookieOptions } from 'express';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto): Promise<{
        accessToken: string,
        refreshTokenCookie: { value: string, options: CookieOptions }
    }> {

        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) throw new UnauthorizedException('Неверные учётные данные');

        const accessToken = this.jwtService.sign(
            { sub: user.id, role: user.role },
            { expiresIn: '1h', secret: this.configService.get<string>('JWT_ACCESS_SECRET') }
        );
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: '7d', secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
        );

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }

        return {
            accessToken,
            refreshTokenCookie: {
                value: refreshToken,
                options: cookieOptions
            }
        };
    }
}
