import { Controller, Get, Post, Param, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { Roles } from './roles.decorator';
import { Role } from '../enums/roles.enum';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from './auth/auth.guard';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        console.log('В контроллере findOne id:', id);
        const user = await this.usersService.findOne(id);
        console.log('Пользователь найден:', user);
        return user;
    }

    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Delete()
    async deleteOne(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}