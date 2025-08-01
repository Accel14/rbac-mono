
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user.id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
