import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/roles.enum'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 500 })
    name: string;

    @Column("varchar", { length: 320, unique: true })
    email: string;

    @Column("varchar")
    passwordHash: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.User
    })
    role: Role;

}