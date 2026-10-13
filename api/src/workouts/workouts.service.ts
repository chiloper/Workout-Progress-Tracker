import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { WorkoutsRepository } from "./repository/workouts.repository";
import { CreateWorkoutDto } from "./dto/workouts.dto";
import { Prisma } from "../../generated/client";
import { WorkoutWithSets } from "./type/workouts.type";

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly workoutsRepository: WorkoutsRepository
  ) { }

  async createWorkout(userId: string, dto: CreateWorkoutDto): Promise<WorkoutWithSets> {
    const ids = [...new Set(dto.sets.map((s) => s.exerciseId))]
    const owned = await this.workoutsRepository.checkExercise(userId, ids)
    if (owned !== ids.length) {
      throw new BadRequestException('Some exercises are invalid or archived.')
    }

    try {
      return await this.workoutsRepository.createWorkout(userId, dto)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ConflictException('Duplicate setNo for the same exerscises.')
        }
      }
      throw e
    }
  }
}
