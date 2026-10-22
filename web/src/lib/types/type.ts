export type CreateWorkoutWithSets = {
  title: string | null;
  performedAt: string;
  durationMinutes: number | null;
  note: string;
  sets: Set[];
}

export type User = {
  id: string
  email: string
}

type Set = {
  exerciseId: string;
  setNo: number;
  weightKg: number;
  reps: number;
}