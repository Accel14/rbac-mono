import { Controller, Post, Body, UnauthorizedException, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { User } from '@entities/user.entity';
import { CreateUserDto } from '@users/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { RefreshTokenGuard } from './refreshtoken.guard';

interface RefreshRequest extends Request {
    user: {
        sub: number;
        role?: string;
        iat?: number;
        exp?: number;
    };
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService) { }

    @ApiOperation({ summary: 'Вход пользователя (логин)' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 201, description: 'Успешный вход. Возвращает access токен' })
    @ApiResponse({ status: 401, description: 'Неверные учётные данные' })
    @Post('login')
    async login(
        @Res({ passthrough: true }) res: Response,
        @Body() loginDto: LoginDto,
    ) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) throw new UnauthorizedException('Неверные учётные данные');

        const accessToken = this.jwtService.sign(
            { sub: user.id, role: user.role },
            { expiresIn: '1h', secret: this.configService.get<string>('JWT_ACCESS_SECRET') }
        );
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: '7d', secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
        );

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: accessToken };
    }

    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'Пользователь успешно создан', type: User })
    @Post('register')
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Обновление access токена по refresh токену' })
    @ApiCookieAuth('refresh_token')
    @ApiResponse({ status: 201, description: 'Возвращает новый access токен' })
    @ApiResponse({ status: 401, description: 'Некорректный или отсутствующий refresh токен' })
    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refresh(@Req() req: RefreshRequest) {
        if (!req.user?.sub) {
            throw new UnauthorizedException('Пользователь не определён');
        }
        const user = await this.usersService.findById(req.user.sub);

        if (!user) throw new UnauthorizedException();

        const accessToken = this.jwtService.sign(
            { sub: user.id, role: user.role },
            {
                expiresIn: '1h',
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            }
        );

        return { access_token: accessToken };
    }
}
