import { MuscleGroup } from '../../../generated/enums';

export type Exercises = {
  name: string;
  muscleGroup: MuscleGroup;
  isArchived: boolean;
  createdAt: string;
};


export type LastExercises = {
  exerciseId: string,
  workoutId: string | undefined,
  performedAt: string | undefined,
  sets: sets[]
}

type sets = {
  setNo: number,
  weightKg: number,
  reps: number
}