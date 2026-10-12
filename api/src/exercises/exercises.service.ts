import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ExercisesRepository } from "./repository/exercises.repository";
import { Exercise, Prisma } from "../../generated/client";
import { CreateExercisesDto, UpdateExercisesDto } from "./dto/exercises.dto";
import { PrismaClientKnownRequestError } from "../../generated/internal/prismaNamespace";

@Injectable()
export class ExercisesService {
  constructor(private readonly exercisesRepository: ExercisesRepository) { }

  async findExercises(userId: string, includeArchived: boolean): Promise<Exercise[]> {
    return await this.exercisesRepository.getExerises(userId, includeArchived)
  }

  async createExercise(userId: string, dto: CreateExercisesDto): Promise<unknown> {
    try {
      return await this.exercisesRepository.createExercises(userId, dto)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new ConflictException(`${dto.name} already exists`)
        }
        throw e
      }
    }
  }

  async updateExercise(id: string, userId: string, dto: UpdateExercisesDto): Promise<unknown> {
    try {
      const exercise = await this.exercisesRepository.getExeriseById(userId, id)
      if (!exercise) {
        throw new NotFoundException()
      }
      return await this.exercisesRepository.updateExercises(id, userId, dto)
    } catch (e) {
      if(e instanceof Prisma.PrismaClientKnownRequestError){
        if(e.code === "P2002"){
          throw new ConflictException(`${dto.name} already exists`)
        }
      }
      throw e
    }
  }
}