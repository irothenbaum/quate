import type Cycle from './cycle'

export default interface Athlete {
  id: string
  name: string
  firstName: string
  lastName: string
  cycles: Cycle[]
}

export interface AthleteInput {
  id?: string
  name: string
}
