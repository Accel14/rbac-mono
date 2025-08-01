import { Controller, Get, Post, Param, UseGuards, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '@entities/user.entity';
import { Roles } from '../roles.decorator';
import { Role } from '../../enums/roles.enum';
import { RolesGuard } from '../roles.guard';
import { CreateUserDto } from '../create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { AuthGuard } from './auth.guard';

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService) { }


    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Неверный логин и/или пароль ');
        }
        return this.authService.login(user);
    }

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }
}
