/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus = TaskStatus.PENDING;
}