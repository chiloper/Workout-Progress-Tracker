import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Exercise } from '../../../generated/client';
import { CreateExercisesDto, UpdateExercisesDto } from '../dto/exercises.dto';

@Injectable()
export class ExercisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getExerises(
    userId: string,
    includeArchived: boolean,
  ): Promise<Exercise[]> {
    return await this.prisma.exercise.findMany({
      where: {
        userId,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getExeriseById(userId: string, id: string): Promise<Exercise | null> {
    return await this.prisma.exercise.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async createExercises(
    userId: string,
    data: CreateExercisesDto,
  ): Promise<Exercise> {
    return await this.prisma.exercise.create({
      data: {
        name: data.name,
        muscleGroup: data.muscleGroup,
        userId: userId,
        isArchived: false,
      },
    });
  }

  async updateExercises(
    id: string,
    userId: string,
    data: UpdateExercisesDto,
  ): Promise<Exercise> {
    return await this.prisma.exercise.update({
      where: {
        userId,
        id,
      },
      data: data,
    });
  }
}
