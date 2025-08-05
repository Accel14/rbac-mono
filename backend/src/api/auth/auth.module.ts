import { Module } from '@nestjs/common';
import { User } from '@entities/user.entity';
import { UsersService } from '@users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'


@Module({
    imports: [
        PassportModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_ACCESS_SECRET');
                return {
                    secret,
                    signOptions: { expiresIn: '1h' },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService],
})
export class AuthModule { }
