import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsRepository } from './repository/workouts.repository';
import { WorkoutsController } from './workouts.controller';

@Module({
  providers: [WorkoutsService, WorkoutsRepository],
  controllers: [WorkoutsController],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
