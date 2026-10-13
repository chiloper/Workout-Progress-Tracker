import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../generated/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateWorkoutDto } from "../dto/workouts.dto";
import { workoutWithSets, WorkoutWithSets } from "../type/workouts.type";


@Injectable()
export class WorkoutsRepository {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async checkExercise(userId: string, exerciseId: string[]): Promise<number> {
    return await this.prisma.exercise.count({
      where: {
        id: { in: exerciseId },
        userId,
        isArchived: false
      }
    })
  }

  async createWorkout(userId: string, dto: CreateWorkoutDto): Promise<WorkoutWithSets> {
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
            exerciseOrder: i + 1,
            setNo: s.setNo,
            weightKg: s.weightKg,
            reps: s.reps
          }))
        }
      },
      include: workoutWithSets
    })
  }
}


