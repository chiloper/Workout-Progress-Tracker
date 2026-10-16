import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateWorkoutDto, getWorkoutsQueryDto } from './dto/workouts.dto';
import { WorkoutsService } from './workouts.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';

@Controller()
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) { }

  @Post('workouts')
  async createWorkouts(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutDto,
  ) {
    return await this.workoutsService.createWorkout(user.id, dto);
  }

  @Get('workouts')
  async getWorkouts(
    @CurrentUser() user: AuthenticatedUser,
    @Query() dto: getWorkoutsQueryDto,
  ) {
    return await this.workoutsService.getWorkouts(
      user.id,
      dto.from,
      dto.to,
      dto.limit,
      dto.offset,
    );
  }

  @Get('workouts/:id')
  async getWorkoutsById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.workoutsService.getWorkoutsById(user.id, id);
  }

  @Delete('workouts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWorkout(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.workoutsService.deleteWorkouts(user.id, id);
  }
}
