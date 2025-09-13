import {Operation, GameAction} from '@/types/game.ts'
import type {TermStep, GameLevel} from '@/types/game.ts'
import {v4 as uuid} from 'uuid'

export function shuffleArray<T>(arr: Array<T>): Array<T> {
  const clone = [...arr]
  let currentIndex = clone.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[clone[currentIndex], clone[randomIndex]] = [clone[randomIndex], clone[currentIndex]]
  }

  return clone
}

export function applyTermStep(n: number, t: TermStep): number {
  switch (t.operation) {
    case Operation.add:
      return n + t.number

    case Operation.subtract:
      return n - t.number

    case Operation.multiply:
      return n * t.number

    case Operation.divide:
      return n / t.number

    case Operation.raise:
      return Math.pow(n, t.number)
  }
}

export function applyTermSteps(n: number, steps: Array<TermStep>): number {
  return steps.reduce((agr, t) => {
    return applyTermStep(agr, t)
  }, n)
}

export function lerp(start: number, target: number, ratio: number): number {
  return start + (target - start) * ratio
}

function isCleaningDividedBy(n: number, d: number): boolean {
  const product = n / d
  return product === Math.floor(product)
}

const DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].reverse()

function getSingleTermStep(levelNum: number, start: number, max: number): TermStep {
  if (max <= 0) {
    console.warn('Max must be > 0')
    max = 1
  }

  const startRatio = start / max

  // determine which operations we can even do based on start/max
  const validOperations: Array<Operation> = Object.values(Operation).filter(o => {
    switch (o) {
      case Operation.add:
        return startRatio < 0.8

      case Operation.subtract:
        return startRatio > 0.2

      case Operation.multiply:
        return levelNum >= 8 && startRatio < 0.4 && start > 0

      case Operation.divide:
        return levelNum >= 12 && startRatio > 0.4 && DIVISORS.some(d => isCleaningDividedBy(start, d))

      case Operation.raise:
        return start > 1 && levelNum >= 16 && Math.pow(start, 2) < max
    }
  }) as Array<Operation>

  const selectedOperation = validOperations[Math.floor(Math.random() * validOperations.length)]

  return generateTermStep(start, max, selectedOperation)
}

function generateTermStep(start: number, max: number, op: Operation, decimals: number = 0): TermStep {
  const retVal: TermStep = {
    operation: op,
    number: 0,
    id: uuid(),
  }

  switch (op) {
    case Operation.add:
      retVal.number = Math.random() * (max - start)
      break

    case Operation.subtract:
      retVal.number = Math.random() * (start - 1) + 1
      break

    case Operation.multiply:
      retVal.number = Math.random() * (max / start)
      break

    case Operation.divide:
      // find the first (largest) one that cleanly divides it
      retVal.number = DIVISORS.find(d => isCleaningDividedBy(start, d)) || 2
      break

    case Operation.raise:
      retVal.number = 2
      break
  }

  retVal.number = parseFloat(retVal.number.toFixed(decimals))

  return retVal
}

const totalTermsSequence = [
  [1],
  [2],
  [2],
  [2],
  [2, 1],
  [2, 1],
  [2, 1],
  [3],
  [3, 1],
  [3, 1],
  [3, 1],
  [2, 2],
  [2, 2],
  [2, 2],
  [3, 2],
  [3, 2],
  [3, 2],
  [1, 3, 1],
  [1, 3, 1],
  [1, 3, 1],
  [2, 2, 1],
  [2, 2, 1],
  [2, 2, 1],
  [2, 2, 2],
  [2, 2, 2],
  [2, 2, 2],
  [2, 3, 2],
  [2, 3, 2],
  [2, 3, 2],
]
// this function generates level with random term values, but whose term orders are set by the term Sequence array
export function generateLevelUsingTermSequence(levelNum: number, difficulty: number, start: number): GameLevel {
  const max = difficulty + 10 * levelNum
  const sequence = totalTermsSequence[levelNum]
  let target: number = start
  const steps: Array<Array<TermStep>> = []

  for (let i = 0; i < sequence.length; i++) {
    const totalTermsThisRow = sequence[i]
    const thisRow: Array<TermStep> = []
    // first we create the real step
    const nextStep: TermStep = getSingleTermStep(levelNum, target, max)
    target = applyTermStep(target, nextStep)
    thisRow.push(nextStep)

    // now we create all the fake values (we number the number of terms this row - 1 because 1 is the correct term)
    for (let j = totalTermsThisRow - 1; j > 0; j--) {
      thisRow.push(getSingleTermStep(levelNum, start, Math.floor(Math.random() * max) + 20))
    }

    steps.push(shuffleArray(thisRow))
  }

  const retVal = {
    start: start,
    steps: steps,
    target: target,
    selected: [],
  }
  console.log('Generated level', retVal, steps[0][0], start, target)

  return retVal
}

// this function generates levels programmatically.
// The resulting levels and their shape is random

// every 5 levels, we increase the complexity of the number of rows
const stepCountInterval = 5
// every 3 levels we increase the number of terms
const totalTermInterval = 3
export function generateLevel(levelNum: number, difficulty: number, start: number): GameLevel {
  const max = difficulty + 10 * levelNum

  const stepCount = Math.floor(levelNum / stepCountInterval) + 1
  const totalTerms = Math.ceil(levelNum / totalTermInterval) + 1
  const steps: Array<TermStep> = []
  let target: number = start

  let stepCounter = stepCount
  while (stepCounter > 0) {
    const nextStep: TermStep = getSingleTermStep(levelNum, target, max)
    steps.push(nextStep)
    target = applyTermStep(target, nextStep)
    stepCounter--
  }

  let numberOfFakes = totalTerms - stepCount
  let minFakeMagnitude = 0
  const fakes: Array<Array<TermStep>> = new Array(stepCount).fill(0).map(() => [])
  while (numberOfFakes > 0) {
    // we don't want to push too many to a single row at once
    // the row with the most fakes should not be more than 2 greater than the smallest
    const viable = fakes.filter(arr => arr.length < minFakeMagnitude + 2)

    const nextFakeRow = Math.floor(Math.random() * viable.length)
    viable[nextFakeRow].push(getSingleTermStep(levelNum, start, Math.floor(Math.random() * max) + 20))

    minFakeMagnitude = fakes.reduce((agr, f) => Math.min(agr, f.length), viable[nextFakeRow].length)
    numberOfFakes--
  }

  const mergedSteps = steps.map((s, i) => shuffleArray([...fakes[i], s]))

  const retVal = {
    start: start,
    steps: mergedSteps,
    target: target,
    selected: [],
  }
  console.log('Generated level', retVal, mergedSteps[0][0], start, target)

  return retVal
}

export const operationToLabel = {
  [Operation.add]: '+',
  [Operation.subtract]: '-',
  [Operation.multiply]: 'x',
  [Operation.divide]: '/',
  [Operation.raise]: '^',
}

export const gameActionToClass = {
  [GameAction.ready]: 'ready',
  [GameAction.starting]: 'starting',
  [GameAction.submission_correct]: 'submission-correct',
  [GameAction.submission_incorrect]: 'submission-incorrect',
  [GameAction.transition_level_start]: 'transitioning-level transition-level-start',
  [GameAction.transition_level_results]: 'transitioning-level transition-level-results',
  [GameAction.transition_level_end]: 'transitioning-level transition-level-end',
}

export function getHoursMinutesSeconds(ms: number): {hours: number; minutes: number; seconds: number} {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {hours, minutes, seconds}
}

export function formatTime(ms: number): string[] {
  const {hours, minutes, seconds} = getHoursMinutesSeconds(ms)
  const parts = []

  if (hours > 0) {
    parts.push(hours.toString().padStart(2, '0'))
  }

  parts.push(minutes.toString().padStart(2, '0'))
  parts.push(seconds.toString().padStart(2, '0'))

  return parts
}

export function isTransitioningLevel(action: GameAction): boolean {
  return [
    GameAction.transition_level_start,
    GameAction.transition_level_results,
    GameAction.transition_level_end,
  ].includes(action)
}
