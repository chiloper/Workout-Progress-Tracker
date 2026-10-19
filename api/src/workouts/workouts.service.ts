import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutsRepository } from './repository/workouts.repository';
import { CreateWorkoutDto } from './dto/workouts.dto';
import { Prisma } from '../../generated/client';
import {
  TopExercises,
  Workout,
  WorkoutsTotal,
  WorkoutWithSets,
} from './type/workouts.type';
import { toWorkoutResponse } from './mapper/workouts.mapper';

@Injectable()
export class WorkoutsService {
  constructor(private readonly workoutsRepository: WorkoutsRepository) {}

  async createWorkout(userId: string, dto: CreateWorkoutDto): Promise<Workout> {
    const ids = [...new Set(dto.sets.map((s) => s.exerciseId))];
    const owned = await this.workoutsRepository.checkExercise(userId, ids);
    if (owned !== ids.length) {
      throw new BadRequestException('Some exercises are invalid or archived.');
    }

    try {
      return toWorkoutResponse(
        await this.workoutsRepository.createWorkout(userId, dto),
      );
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(
            'Duplicate setNo for the same exerscises.',
          );
        }
      }
      throw e;
    }
  }

  async getWorkoutsById(userId: string, id: string): Promise<Workout> {
    const workout = await this.workoutsRepository.getWorkoutsById(userId, id);
    if (!workout) {
      throw new NotFoundException('Workout Not Found');
    }
    return toWorkoutResponse(workout);
  }

  async getWorkouts(
    userId: string,
    from: string,
    to: string,
    limit: number,
    offset: number,
  ): Promise<WorkoutsTotal> {
    if (new Date(from) > new Date(to)) {
      throw new BadRequestException();
    }
    const [workouts, count] = await Promise.all([
      this.workoutsRepository.getWorkouts(userId, from, to, limit, offset),
      this.workoutsRepository.getTotalWorkouts(userId, from, to),
    ]);

    const workoutsTotol: WorkoutsTotal = {
      items: workouts.map((s) => ({
        id: s.id,
        title: s.title!,
        performedAt: s.performedAt.toISOString(),
        durationMinutes: s.durationMinutes!,
        exerciseCount: [...new Set(s.workoutSets.map((e) => e.exerciseId))]
          .length,
        setCount: s.workoutSets.length,
        totalVolume: s.workoutSets.reduce(
          (sum, item) => sum + item.weightKg.toNumber() * item.reps,
          0,
        ),
        topExercises: this.topExercises(s),
      })),
      total: count,
    };

    return workoutsTotol;
  }

  async deleteWorkouts(userId: string, id: string): Promise<void> {
    const workouts = await this.workoutsRepository.getWorkoutsById(userId, id);
    if (!workouts) {
      throw new NotFoundException(`workouts not found`);
    }
    await this.workoutsRepository.deleteWorkouts(id);
  }

  private topExercises(
    item: Pick<WorkoutWithSets, 'workoutSets'>,
  ): TopExercises[] {
    const sortedSets = [...item.workoutSets].sort(
      (a, b) => Number(b.weightKg) - Number(a.weightKg),
    );
    const seenIds = new Set<string>();
    return sortedSets
      .filter((item) => {
        const isNotDuplicate = !seenIds.has(item.exerciseId);
        if (isNotDuplicate) {
          seenIds.add(item.exerciseId);
          return true;
        }
        return false;
      })
      .slice(0, 2)
      .map((item) => {
        return {
          name: item.exercise.name,
          weightKg: item.weightKg.toNumber(),
          reps: item.reps,
        } satisfies TopExercises;
      });
  }
}
