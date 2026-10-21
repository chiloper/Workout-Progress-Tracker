export type CreateWorkoutWithSets = {
  title: string | null;
  performedAt: string;
  durationMinutes: number | null;
  note: string;
  sets: Set[];
}

type Set = {
  exerciseId: string;
  setNo: number;
  weightKg: number;
  reps: number;
}