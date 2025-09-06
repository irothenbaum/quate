import {Operation} from '@/types/game.ts'
import type {TermStep, GameLevel} from '@/types/game.ts'

export function shuffleArray<T>(arr: Array<T>): void {
  let currentIndex = arr.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
  }
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
    throw new Error('Max must be > 0')
  }

  const startRatio = start / max

  // determine which operations we can even do based on start/max
  const validOperations: Array<Operation> = Object.values(Operation).filter(o => {
    switch (o) {
      case Operation.add:
        return startRatio < 0.8

      case Operation.subtract:
        return levelNum >= 4 && startRatio > 0.2

      case Operation.multiply:
        return levelNum >= 8 && startRatio < 0.4 && start > 0

      case Operation.divide:
        return levelNum >= 12 && startRatio > 0.4 && DIVISORS.some(d => isCleaningDividedBy(start, d))

      case Operation.raise:
        return levelNum >= 16 && Math.pow(start, 2) < max
    }
  }) as Array<Operation>

  const selectedOperation = validOperations[Math.floor(Math.random() * validOperations.length)]

  return generateTermStep(start, max, selectedOperation)
}

function generateTermStep(start: number, max: number, op: Operation, decimals: number = 0): TermStep {
  const retVal: TermStep = {
    operation: op,
    number: 0,
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
  console.log('Generating Level Using Term Sequence', {levelNum, difficulty, start})
  const max = difficulty + 10 * levelNum
  const sequence = totalTermsSequence[levelNum]
  let target: number = start
  const steps: Array<Array<TermStep>> = []

  for (let i = 0; i < sequence.length; i++) {
    const totalTermsThisRow = sequence[i]
    const thisRow: Array<TermStep> = []
    // first we create the real step
    const nextStep: TermStep = getSingleTermStep(levelNum, target, max)
    console.log('Previous target:', target, 'Next step:', nextStep)
    target = applyTermStep(target, nextStep)
    console.log('New target:', target)
    thisRow.push(nextStep)

    // now we create all the fake values (we number the number of terms this row - 1 because 1 is the correct term)
    for (let j = totalTermsThisRow - 1; j > 0; j--) {
      thisRow.push(getSingleTermStep(levelNum, start, Math.floor(Math.random() * max)))
    }

    steps.push(thisRow)
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
  console.log('Generating Level', {levelNum, difficulty, start})
  const max = difficulty + 10 * levelNum

  const stepCount = Math.floor(levelNum / stepCountInterval) + 1
  const totalTerms = Math.ceil(levelNum / totalTermInterval) + 1
  const steps: Array<TermStep> = []
  let target: number = start

  let stepCounter = stepCount
  while (stepCounter > 0) {
    const nextStep: TermStep = getSingleTermStep(levelNum, target, max)
    steps.push(nextStep)
    console.log('Previous target:', target, 'Next step:', nextStep)
    target = applyTermStep(target, nextStep)
    console.log('New target:', target)
    stepCounter--
  }

  let numberOfFakes = totalTerms - stepCount
  let minFakeMagnitude = 0
  const fakes: Array<Array<TermStep>> = new Array(stepCount).fill([])
  while (numberOfFakes > 0) {
    // we don't want to push too many to a single row at once
    // the row with the most fakes should not be more than 2 greater than the smallest
    const viable = fakes.filter(arr => arr.length < minFakeMagnitude + 2)

    const nextFakeRow = Math.floor(Math.random() * viable.length)
    viable[nextFakeRow].push(getSingleTermStep(levelNum, start, Math.floor(Math.random() * max)))

    minFakeMagnitude = fakes.reduce((agr, f) => Math.min(agr, f.length), viable[nextFakeRow].length)
    numberOfFakes--
  }

  const mergedSteps = steps.map((s, i) => [...fakes[i], s])
  shuffleArray(mergedSteps)

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
