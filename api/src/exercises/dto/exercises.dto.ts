import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { MuscleGroup } from "../../../generated/enums";

export class CreateExercisesDto {

  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'name must be at least 1 characters.' })
  @MaxLength(60, { message: 'name muse be as most 72 characters.' })
  name!: string

  @IsBoolean()
  @IsOptional()
  isArchived!: boolean

  @IsEnum(MuscleGroup)
  @IsOptional()
  muscleGroup!: MuscleGroup
}

export class UpdateExercisesDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'name must be at least 1 characters.' })
  @MaxLength(60, { message: 'name muse be as most 72 characters.' })
  name!: string

  @IsEnum(MuscleGroup)
  @IsNotEmpty()
  muscleGroup!: MuscleGroup
}