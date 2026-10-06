import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  DIRECT_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN!: string;

  @IsString()
  @IsNotEmpty()
  SEED_EMAIL!: string;

  @IsString()
  @IsNotEmpty()
  SEED_PASSWORD!: string;

  @IsNumber()
  @IsOptional()
  PORT!: number;
}
