import { Controller, Get, Post, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    // @Get()
    // async findAll(): Promise<User[]> {
    //     return this.usersService.findAll();
    // }
    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return "yeah";
    }

    @Post(':id')
    addOne(@Param('id') id: string) {
        return this.usersService.addOne
    }

}