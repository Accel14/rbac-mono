import { Injectable } from "@nestjs/common";
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
    private readonly users: User[] = [];

    findAll(): User[] {
        return this.users;
    }

    findOne(id: number): User {
        return this.users[id];
    }

    addOne(user: User): User[] {
        this.users.push(user);
        return this.users;
    }

    deleteOne(user: User): User[] {
        this.users.filter;
        return this.users;
    }
}