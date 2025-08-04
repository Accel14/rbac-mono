import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/enums/roles.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123', description: 'Пароль пользователя' })
    @IsString()
    password: string;

    @ApiProperty({ example: 'Admin', description: 'Роль пользователя' })
    role: Role;

}