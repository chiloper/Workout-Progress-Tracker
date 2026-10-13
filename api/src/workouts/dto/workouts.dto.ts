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
  MaxLength,
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
  title!: string;

  @IsDateString()
  @IsOptional()
  performedAt!: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  durationMinutes!: number;

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
