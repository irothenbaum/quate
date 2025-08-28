import type Exercise from './exercise'

export enum WorkoutStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// workout is an emergent type that represents all exercises on a given day
export default interface Workout {
  id: string
  label: string
  week: number
  day: number
  exercises: Array<Exercise>
  status: WorkoutStatus
}
