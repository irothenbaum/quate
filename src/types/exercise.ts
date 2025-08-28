import type Cycle from './cycle'
import type MaxLog from './maxLog'

export interface ExerciseSet {
  id: string
  goalReps: number
  goalWeight: number
  actualReps?: number
  actualWeight?: number
  isCompleted?: boolean
  isGoalAchieved?: boolean
  linkedSetId?: string
  linkedSet?: ExerciseSet
  isElective?: boolean
}

export interface ExerciseSetInput {
  id?: string
  goalReps: number
  goalWeight: number
  actualReps?: number
  actualWeight?: number
  linkedSetId?: string
  isElective?: boolean
}

export default interface Exercise {
  id: string
  name: string
  week: number
  day: number
  order: number
  equipment: string
  cycleId: string
  cycle?: Cycle
  sets: [ExerciseSet]
  setsGrouped: [ExerciseSet] // this is the same as sets except linkedSets are grouped together
  setsLookup: Record<string, ExerciseSet>
  startedAt?: Date
  completedAt?: Date
  maxLog?: MaxLog
}

export interface ExerciseInput {
  id?: string
  name: string
  week: number
  day: number
  order: number
  cycleId: string
  byCycleSortKey?: string
  sets: ExerciseSetInput[]
  equipment?: string
  startedAt?: Date
  completedAt?: Date
}
