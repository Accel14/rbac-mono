import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
    email: string;

    @IsString()
    @ApiProperty({ example: 'strongPassword123', description: 'Пароль пользователя' })
    password: string;
}
