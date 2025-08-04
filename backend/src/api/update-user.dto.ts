import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enums/roles.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Иван Иванов', description: 'Новое имя пользователя' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'newemail@example.com', description: 'Новый email пользователя' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'Admin', description: 'Роль пользователя', enum: Role })
    @IsOptional()
    role?: Role;
}
