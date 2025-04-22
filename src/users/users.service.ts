/* eslint-disable prettier/prettier */
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { username, email } = createUserDto;

        // Check if username or email already exists
        const existingUser = await this.usersRepository.findOne({
            where: [{ username }, { email }],
        });

        if (existingUser) {
            throw new ConflictException('Username or email already exists');
        }

        const user = this.usersRepository.create(createUserDto);
        return this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }
        return user;
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: Partial<User>): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }

    async remove(id: string): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}