import { User } from '../entities/user.entity';
import { Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './create-user.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User | null> {
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

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

}