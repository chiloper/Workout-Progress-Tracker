import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkoutDto } from '../dto/workouts.dto';
import { workoutWithSets, WorkoutWithSets } from '../type/workouts.type';

@Injectable()
export class WorkoutsRepository {
  constructor(private readonly prisma: PrismaService) { }

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
    for (const s of dto.sets) if (!order.has(s.exerciseId)) order.set(s.exerciseId, order.size + 1);
    return this.prisma.workout.create({
      data: {
        userId,
        title: dto.title,
        performedAt: dto.performedAt,
        durationMinutes: dto.durationMinutes,
        note: dto.note,
        workoutSets: {
          create: dto.sets.map((s, i) => ({
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
}
