import type {Ref} from 'vue'

export interface GameSettings {
  difficulty: number
}

export enum Operation {
  add,
  subtract,
  multiply,
  divide,
  raise,
}

export interface TermStep {
  operation: Operation
  number: number
}

export interface GameLevel {
  start: number
  target: number
  steps: Array<TermStep>
}

export interface GameState {
  unit_score: number
  bonus_score: number
  health: number
  solutions: Array<GameLevel>
  score?: number // computed from unit_score + bonus_score
  level_number?: number // computed from solutions.length + 1
  level_state?: GameLevel // when the game's over this may be empty
}

export interface GameStore {
  settings: Ref<GameSettings>
  state: Ref<GameState>

  startNextLevel: (l: GameLevel) => void
  increaseScore: (u: number, b: number) => void
}
