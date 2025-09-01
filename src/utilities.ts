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
      return n / t.number

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

function getSingleTermStep(start: number, max: number): TermStep {
  const startRatio = start / max

  // determine which operations we can even do based on start/max
  const validOperations: Array<Operation> = Object.values(Operation).filter(o => {
    switch (o) {
      case Operation.add:
        return startRatio < 0.8

      case Operation.subtract:
        return startRatio > 0.2

      case Operation.multiply:
        return startRatio < 0.4

      case Operation.divide:
        return startRatio > 0.4 && DIVISORS.some(d => isCleaningDividedBy(start, d))

      case Operation.raise:
        return Math.pow(start, 2) < max
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
      retVal.number = Math.random() * max - start
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

export function generateLevel(start: number, max: number, stepCount: number, totalTerms: number): GameLevel {
  console.log('Generating Level', {start, max, stepCount, totalTerms})

  const steps: Array<TermStep> = []
  let target: number = start

  let stepCounter = stepCount
  while (stepCounter > 0) {
    const nextStep: TermStep = getSingleTermStep(target, max)
    steps.push(nextStep)
    target = applyTermStep(target, nextStep)
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
    viable[nextFakeRow].push(getSingleTermStep(start, Math.floor(Math.random() * max)))

    minFakeMagnitude = fakes.reduce((agr, f) => Math.min(agr, f.length), viable[nextFakeRow].length)
    numberOfFakes--
  }

  const mergedSteps = steps.map((s, i) => [...fakes[i], s])
  shuffleArray(mergedSteps)

  console.log(
    'Generated level',
    {
      start: start,
      steps: mergedSteps,
      target: target,
      selected: [],
    },
    mergedSteps[0][0],
    start,
    target,
  )

  return {
    start: start,
    steps: mergedSteps,
    target: target,
    selected: [],
  }
}

export const operationToLabel = {
  [Operation.add]: '+',
  [Operation.subtract]: '-',
  [Operation.multiply]: 'x',
  [Operation.divide]: '/',
  [Operation.raise]: '^',
}
