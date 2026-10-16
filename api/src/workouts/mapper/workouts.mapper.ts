import { WorkoutWithSets } from '../type/workouts.type';

export function toWorkoutResponse(w: WorkoutWithSets) {
  const byExercise = new Map<
    string,
    {
      exerciseId: string;
      name: string;
      muscleGroup: string;
      exerciseOrder: number;
      sets: { setNo: number; weightKg: number; reps: number }[];
    }
  >();

  for (const s of w.workoutSets) {
    let group = byExercise.get(s.exerciseId);
    if (!group) {
      group = {
        exerciseId: s.exercise.id,
        name: s.exercise.name,
        muscleGroup: s.exercise.muscleGroup,
        exerciseOrder: s.exerciseOrder,
        sets: [],
      };
      byExercise.set(s.exerciseId, group);
    }
    group.sets.push({
      setNo: s.setNo,
      weightKg: s.weightKg.toNumber(),
      reps: s.reps,
    });
  }

  return {
    id: w.id,
    title: w.title,
    performedAt: w.performedAt,
    durationMinutes: w.durationMinutes,
    note: w.note,
    exercises: [...byExercise.values()],
  };
}
