import type {Ref} from 'vue'

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
  steps: Array<Array<TermStep>> // columns and rows
  selected: Array<number> // each element is the index of the selected step. The order is the order of columns
  // for examples:
  // steps = [[A,B,C],[D,E,F],[G,H,I]]
  // the user selects B, F, G
  // selected = [1,2,0]
}

export interface GameState {
  unit_score: Ref<number>
  bonus_score: Ref<number>
  health: Ref<number>
  solutions: Ref<Array<GameLevel>>
  score: Ref<number> // computed from unit_score + bonus_score
  levels_completed: Ref<number> // computed from solutions.length + 1
  level_state: Ref<GameLevel | undefined> // will be empty at the start/end of the game
}

export interface GameSettings {
  difficulty: Ref<number>
}

export interface GameStore extends GameSettings, GameState {
  startNextLevel: (l: GameLevel) => void
  increaseScore: (u: number, b: number) => void
  handleClickTerm: (term: TermStep, column: number, row: number) => void
  restartGame: () => void
}
