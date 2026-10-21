export const MuscleGroup = {
  CHEST: 'CHEST',
  BACK: 'BACK',
  SHOULDERS: 'SHOULDERS',
  ARMS: 'ARMS',
  LEGS: 'LEGS',
  CORE: 'CORE',
  FULL_BODY: 'FULL_BODY'
} as const

export type MuscleGroup = (typeof MuscleGroup)[keyof typeof MuscleGroup]