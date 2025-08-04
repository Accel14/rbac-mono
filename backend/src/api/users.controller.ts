import { Controller, Get, Param, UseGuards, Delete, Put, Request, Body, ForbiddenException, Req, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
import { Roles } from './roles.decorator';
import { Role } from '../enums/roles.enum';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { UpdateUserDto } from './update-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiForbiddenResponse, ApiNoContentResponse } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Получить всех пользователей' })
    @ApiResponse({ status: 200, description: 'Пользователи найдены' })
    @ApiForbiddenResponse({ description: 'Доступ запрещён' })

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }



    @ApiOperation({ summary: 'Получить пользователя по ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь найден' })
    @ApiForbiddenResponse({ description: 'Доступ запрещён' })

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

    @ApiOperation({ summary: 'Обновить пользователя по ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
    @ApiForbiddenResponse({ description: 'Доступ запрещён' })

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.Admin, Role.Manager)
    @Put(':id')
    async update(@Param('id') id: number, @Request() req, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }


    @ApiOperation({ summary: 'Удалить пользователя по ID' })
    @ApiParam({ name: 'id', type: Number, description: 'ID пользователя' })
    @ApiNoContentResponse({ description: 'Пользователь успешно удалён' })
    @ApiForbiddenResponse({ description: 'Доступ запрещён' })

    @HttpCode(204)
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @Delete(':id')
    async deleteOne(@Param('id') idParam: number, @Request() req) {
        const id = Number(idParam);
        const requestingUserId = Number(req.user.sub);
        if (requestingUserId === id) {
            throw new ForbiddenException('Администратор не может удалить самого себя.');
        }
        return;
    }
}