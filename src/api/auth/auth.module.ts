import { Module } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
@Module({

    imports: [
        PassportModule,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService],
})
export class AuthModule { }
