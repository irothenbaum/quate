import type Athlete from './athlete'
import type Exercise from './exercise'

export default interface MaxLog {
  id: string
  athleteId: string
  athlete?: Athlete
  exerciseName: string
  weight: number
  exerciseId?: string
  exercise?: Exercise
  createdAt: string
}

export interface MaxLogInput {
  id?: string
  athleteId?: string
  exerciseName: string
  weight: number
  exerciseId?: string
}
