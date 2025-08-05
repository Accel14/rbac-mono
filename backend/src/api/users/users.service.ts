import * as bcrypt from 'bcrypt';
import { User } from '@entities/user.entity';
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { DeepPartial } from 'typeorm';
import { Role } from '@enums/roles.enum';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findById(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }

    findByName(name: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ name });
    }

    findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ email });
    }

    async create(data: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        const user = this.usersRepository.create({
            name: data.name,
            email: data.email,
            passwordHash: hashedPassword,
            role: data.role,
        });

        try {
            return await this.usersRepository.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new BadRequestException('Пользователь с таким email уже существует');
            }
            throw new InternalServerErrorException();
        }

    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const partialUser: DeepPartial<User> = { ...updateUserDto };
        await this.usersRepository.update({ id }, partialUser);
        const user = await this.findById(id);

        if (!user) {
            throw new NotFoundException(`Пользователь с id ${id} не найден`);
        }

        return user;
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }
}