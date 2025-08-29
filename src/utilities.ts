import {Operation} from '@/types/game.ts'
import type {TermStep, GameLevel} from '@/types/game.ts'

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
  return product === parseInt(product)
}

const DIVISORS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].reverse()

function getSingleTermStep(start: number, max: number): TermStep {
  const startRatio = start / max

  // determine which operations we can even do based on start/max
  const validOperations: Array<Operation> = Object.keys(Operation).filter(o => {
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
  })

  const selectedOperation = validOperations[Math.floor(Math.random() * validOperations.length)]

  return generateTermStep(start, max, selectedOperation)
}

function generateTermStep(start: number, max: number, op: Operation, decimals: number = 0): TermStep {
  const retVal: TermStep = {
    operation: op,
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
      retVal.number = DIVISORS.find(d => isCleaningDividedBy(start, d))
      break

    case Operation.raise:
      retVal.number = 2
  }

  retVal.number = parseFloat(retVal.number.toFixed(decimals))
  return retVal
}

export function generateLevel(start: number, max: number, stepCount: number): GameLevel {
  const steps: Array<TermStep> = []
  let target: number = start

  while (stepCount > 0) {
    const nextStep: TermStep = getSingleTermStep(target, max)
    steps.push(nextStep)
    target = applyTermStep(target, nextStep)
  }

  return {
    start: start,
    steps: steps,
    target: target,
  }
}
