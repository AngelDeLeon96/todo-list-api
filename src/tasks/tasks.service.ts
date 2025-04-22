import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private tasksRepository: Repository<Task>,
    ) { }

    async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
        const task = this.tasksRepository.create({
            ...createTaskDto,
            user: { id: userId },
            status: createTaskDto.status || 'pending',
        });

        return this.tasksRepository.save(task);
    }

    async findAll(userId: string): Promise<Task[]> {
        return this.tasksRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, userId: string): Promise<Task> {
        const task = await this.tasksRepository.findOne({
            where: { id, user: { id: userId } },
            relations: ['user'],
        });

        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }

        return task;
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
        const task = await this.findOne(id, userId);

        if (task.user.id !== userId) {
            throw new ForbiddenException('You do not have permission to update this task');
        }

        Object.assign(task, updateTaskDto);
        return this.tasksRepository.save(task);
    }

    async remove(id: string, userId: string): Promise<void> {
        const task = await this.findOne(id, userId);

        if (task.user.id !== userId) {
            throw new ForbiddenException('You do not have permission to delete this task');
        }

        await this.tasksRepository.remove(task);
    }
}