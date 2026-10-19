import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateSetDto } from './set.dto';
import { Type } from 'class-transformer';

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Your message exceeds the maximum limit of 100 characters.',
  })
  title!: string | null;

  @IsDateString()
  @IsOptional()
  performedAt!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  durationMinutes!: number | null;

  @IsOptional()
  @IsString()
  note!: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreateSetDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  sets!: CreateSetDto[];
}

export class getWorkoutsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString()
  from!: string;

  @IsOptional()
  @IsNotEmpty()
  to!: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt({ message: 'limit should be a number' })
  @Min(1)
  @Max(50)
  limit: number = 20;

  @IsNotEmpty()
  @IsInt({ message: 'limit should be a number' })
  @Type(() => Number)
  @Min(0)
  offset: number = 0;
}
