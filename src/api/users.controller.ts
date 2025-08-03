import { Controller, Get, Post, Param, UseGuards, Delete, Put, Request, Body, ForbiddenException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { Roles } from './roles.decorator';
import { Role } from '../enums/roles.enum';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { UpdateUserDto } from './update-user.dto';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }


    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') idParam: number, @Req() req) {
        const id = Number(idParam);
        const requestingUserId = Number(req.user.sub);
        const requestingUserRole = req.user.role;

        if (requestingUserRole === Role.Admin || requestingUserId === id) {
            return await this.usersService.findOne(id);
        } else {
            throw new ForbiddenException('У вас недостаточно прав для доступа к этим данным');
        }
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    async update(@Param('id') id: number, @Request() req, @Body() updateUserDto: UpdateUserDto) {
        const currentUser = req.user;
        const targetId = Number(id);
        const isAdmin = currentUser.role === 'admin';
        const isSelf = currentUser.sub === targetId;

        if (!isAdmin && !isSelf) {
            throw new ForbiddenException('Доступ запрещён');
        }

        return this.usersService.update(targetId, updateUserDto);
    }

    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Delete(':id')
    async deleteOne(@Param('id') idParam: number, @Request() req) {
        const id = Number(idParam);
        const requestingUserId = Number(req.user.sub);

        if (requestingUserId === id) {
            throw new ForbiddenException('Администратор не может удалить самого себя.');
        }

        return this.usersService.remove(id);
    }
}