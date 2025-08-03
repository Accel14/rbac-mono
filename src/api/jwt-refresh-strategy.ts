
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { User } from '@entities/user.entity';
@Injectable()

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private usersService: UsersService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        });
    }

    async validate(payload: any) {
        const authUser = await this.usersService.findOne(payload.sub);
        if (!authUser) {
            throw new UnauthorizedException();
        }
        return {
            attributes: authUser,
            refreshTokenExpiresAt: new Date(payload.exp * 1000),
        };
    }
}
