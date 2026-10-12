import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MuscleGroup } from '../../../generated/enums';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateExercisesDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'name must be at least 1 characters.' })
  @MaxLength(60, { message: 'name must be as most 60 characters.' })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : (value as unknown),
  )
  name!: string;

  @IsEnum(MuscleGroup)
  @IsNotEmpty()
  muscleGroup!: MuscleGroup;
}

export class UpdateExercisesDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'name must be at least 1 characters.' })
  @MaxLength(60, { message: 'name must be as most 60 characters.' })
  @Transform(({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim() : (value as unknown),
  )
  name!: string;

  @IsBoolean()
  @IsOptional()
  isArchived!: boolean;

  @IsEnum(MuscleGroup)
  @IsOptional()
  muscleGroup!: MuscleGroup;
}
