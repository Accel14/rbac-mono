import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@enums/roles.enum'
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 500 })
    name: string;

    @ApiProperty()
    @Column("varchar", { length: 320, unique: true })
    email: string;

    @ApiProperty()
    @Column("varchar")
    passwordHash: string;

    @ApiProperty()
    @Column({
        type: "enum",
        enum: Role,
        default: Role.User
    })
    role: Role;
}