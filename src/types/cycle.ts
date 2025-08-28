import type Athlete from './athlete'
import type Workout from './workout'

export enum CycleStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  UNDERWAY = 'UNDERWAY',
  COMPLETED = 'COMPLETED',
}

export default interface Cycle {
  id: string
  order: number
  label: string
  athleteId: string
  athlete?: Athlete
  workouts: Workout[]
  status: CycleStatus
  exerciseNotes: Record<string, string>
}

export interface CycleInput {
  id?: string
  order: number
  label: string
  athleteId: string
  status: CycleStatus
}
