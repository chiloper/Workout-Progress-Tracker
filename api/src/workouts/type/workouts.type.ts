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
