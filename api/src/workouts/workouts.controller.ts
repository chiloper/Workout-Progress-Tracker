import { Body, Controller, Post } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/workouts.dto';
import { WorkoutsService } from './workouts.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';
import { toWorkoutResponse } from './mapper/workouts.mapper';

@Controller()
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post('workouts')
  async createWorkouts(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutDto,
  ) {
    const workouts = await this.workoutsService.createWorkout(user.id, dto);
    return toWorkoutResponse(workouts);
  }
}
