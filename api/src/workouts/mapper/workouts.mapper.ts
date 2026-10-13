import { WorkoutWithSets } from '../type/workouts.type';

export function toWorkoutResponse(w: WorkoutWithSets) {
  return {
    id: w.id,
    title: w.title,
    performedAt: w.performedAt,
    durationMinutes: w.durationMinutes,
    note: w.note,
    sets: w.workoutSets.map((s) => ({
      exerciseOrder: s.exerciseOrder,
      setNo: s.setNo,
      weightKg: s.weightKg.toNumber(),
      reps: s.reps,
      exercise: s.exercise,
    })),
  };
}
