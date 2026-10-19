import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkoutDto } from '../dto/workouts.dto';
import { workoutWithSets, WorkoutWithSets } from '../type/workouts.type';

@Injectable()
export class WorkoutsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkExercise(userId: string, exerciseId: string[]): Promise<number> {
    return await this.prisma.exercise.count({
      where: {
        id: { in: exerciseId },
        userId,
        isArchived: false,
      },
    });
  }

  async createWorkout(
    userId: string,
    dto: CreateWorkoutDto,
  ): Promise<WorkoutWithSets> {
    const order = new Map<string, number>();
    for (const s of dto.sets)
      if (!order.has(s.exerciseId)) order.set(s.exerciseId, order.size + 1);
    return this.prisma.workout.create({
      data: {
        userId,
        title: dto.title,
        performedAt: dto.performedAt,
        durationMinutes: dto.durationMinutes,
        note: dto.note,
        workoutSets: {
          create: dto.sets.map((s) => ({
            exerciseId: s.exerciseId,
            exerciseOrder: order.get(s.exerciseId)!,
            setNo: s.setNo,
            weightKg: s.weightKg,
            reps: s.reps,
          })),
        },
      },
      include: workoutWithSets,
    });
  }

  async deleteWorkouts(id: string): Promise<void> {
    await this.prisma.workout.delete({
      where: {
        id,
      },
    });
  }

  async getWorkoutsById(
    userId: string,
    id: string,
  ): Promise<WorkoutWithSets | null> {
    return this.prisma.workout.findFirst({
      where: {
        userId,
        id,
      },
      include: workoutWithSets,
    });
  }

  async getTotalWorkouts(
    userId: string,
    from: string,
    to: string,
  ): Promise<number> {
    return await this.prisma.workout.count({
      where: {
        userId,
        performedAt: {
          ...(from && { gte: new Date(`${from}T00:00:00+07:00`) }),
          ...(to && { lte: new Date(`${to}T23:59:59+07:00`) }),
        },
      },
    });
  }

  async getWorkouts(
    userId: string,
    from: string,
    to: string,
    limit: number,
    offset: number,
  ): Promise<WorkoutWithSets[]> {
    return await this.prisma.workout.findMany({
      where: {
        userId,
        performedAt: {
          ...(from && { gte: new Date(`${from}T00:00:00+07:00`) }),
          ...(to && { lte: new Date(`${to}T23:59:59+07:00`) }),
        },
      },
      include: workoutWithSets,
      orderBy: [
        {
          performedAt: 'desc',
          createdAt: 'desc',
        },
      ],
      take: limit,
      skip: offset,
    });
  }
}
