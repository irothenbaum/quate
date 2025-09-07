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

export interface LineCoords {
  x0: number
  y0: number
  x1: number
  y1: number
}
