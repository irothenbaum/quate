export enum Operation {
  add,
  subtract,
  multiply,
  divide,
  raise,
}

export enum GameAction {
  menu,
  starting,
  ready,
  submission_correct,
  submission_incorrect,
  transition_level_start,
  transition_level_results,
  transition_level_end,
  game_over,
}

export interface TermStep {
  operation: Operation
  number: number
  id: string
}

export interface GameLevel {
  start: number
  target: number
  steps: Array<Array<TermStep>> // columns and rows
  selected: Array<number> // each element is the index of the selected step. The order is the order of columns
  started_timestamp?: number
  completed_timestamp?: number
  expiration_timestamp?: number
  // for examples:
  // steps = [[A,B,C],[D,E,F],[G,H,I]]
  // the user selects B, F, G
  // selected = [1,2,0]
}

export interface LineCoords {
  x0: number
  y0: number
  x1: number
  y1: number
}
