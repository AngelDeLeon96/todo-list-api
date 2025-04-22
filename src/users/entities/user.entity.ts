/* eslint-disable prettier/prettier */
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    @Exclude()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: true })
    fullName: string;

    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date;

    @OneToMany(() => Task, task => task.user)
    @Exclude()
    tasks: Task[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}