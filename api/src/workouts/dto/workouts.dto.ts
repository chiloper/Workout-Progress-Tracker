import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSetDto } from './set.dto';
import { Type } from 'class-transformer';

export class CreateWorkoutDto {
  @IsOptional()
  @IsString()
  title!: string;

  @IsDateString()
  @IsOptional()
  performedAt!: string;

  @IsOptional()
  @IsNumber()
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
