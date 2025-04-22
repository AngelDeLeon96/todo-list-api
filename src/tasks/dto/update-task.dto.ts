/* eslint-disable prettier/prettier */
import { IsEnum, IsOptional, IsString } from 'class-validator';

enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskStatus, { message: 'Status must be pending, in-progress, or completed' })
    status?: TaskStatus;
}