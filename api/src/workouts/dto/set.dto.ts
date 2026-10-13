import { IsInt, IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateSetDto {
  @IsNotEmpty()
  @IsUUID()
  exerciseId!: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  setNo!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(1000)
  weightKg!: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  reps!: number;
}
