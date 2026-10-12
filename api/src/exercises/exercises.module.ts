import { Module } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { ExercisesController } from "./exercises.controller";
import { ExercisesRepository } from "./repository/exercises.repository";

@Module({

  providers: [
    ExercisesService,
    ExercisesRepository,
  ],
  controllers: [ExercisesController],
  exports: [ExercisesService]
})
export class ExercisesModule { }