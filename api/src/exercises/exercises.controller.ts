import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/types/auth.types';
import { ExercisesService } from './exercises.service';
import { Exercise } from '../../generated/client';
import { CreateExercisesDto, UpdateExercisesDto } from './dto/exercises.dto';

@Controller()
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) { }

  @Get('exercises')
  getExercises(
    @CurrentUser() user: AuthenticatedUser,
    @Query('includeArchived') includeArchived: boolean = false,
  ): Promise<Exercise[]> {
    return this.exercisesService.findExercises(user.id, includeArchived);
  }

  @Post('exercises')
  createExercises(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateExercisesDto,
  ) {
    return this.exercisesService.createExercise(user.id, dto);
  }

  @Patch('exercises/:id')
  updateExercises(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateExercisesDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.exercisesService.updateExercise(id, user.id, dto);
  }

  @Get('erercises/:id/last')
  getLastExercisesById(
    @CurrentUser() User: AuthenticatedUser,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.exercisesService.getLastExercisesById(User.id, id)
  }
}
