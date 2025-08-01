import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { Roles } from './roles.decorator';
import { Role } from '../enums/roles.enum';
import { RolesGuard } from './roles.guard';
import { CreateUserDto } from './create-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private usersService: UsersService) { }

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.usersService.create(createUserDto);
    }
}