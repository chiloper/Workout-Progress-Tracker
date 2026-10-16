import { MuscleGroup } from '../../../generated/enums';

export type Exercises = {
  name: string;
  muscleGroup: MuscleGroup;
  isArchived: boolean;
  createdAt: string;
};
