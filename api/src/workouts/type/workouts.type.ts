import { Prisma } from '../../../generated/client';

export const workoutWithSets = {
  workoutSets: {
    orderBy: [{ exerciseOrder: 'asc' }, { setNo: 'asc' }],
    include: {
      exercise: { select: { id: true, name: true, muscleGroup: true } },
    },
  },
} satisfies Prisma.WorkoutInclude;

export type WorkoutWithSets = Prisma.WorkoutGetPayload<{
  include: typeof workoutWithSets;
}>;

export type WorkoutsWithTopExercise = {
  id: string;
  title: string;
  performedAt: string;
  durationMinutes: number;
  exerciseCount: number;
  setCount: number;
  totalVolume: number;
  topExercise: TopExercise[];
};

export type TopExercise = {
  name: string;
  weightKg: number;
  reps: number;
};

export type WorkoutsTotal = {
  items: WorkoutsWithTopExercise[];
  total: number;
};

export type Workout = {
  id: string;
  title: string | null;
  performedAt: Date;
  durationMinutes: number | null;
  note: string | null;
  exercises: {
    exerciseId: string;
    name: string;
    muscleGroup: string;
    exerciseOrder: number;
    sets: {
      setNo: number;
      weightKg: number;
      reps: number;
    }[];
  }[];
};
