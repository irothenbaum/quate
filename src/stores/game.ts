import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import type {GameStore, GameSettings, GameState, GameLevel} from '@/types/game.ts'

const STARTING_GAME_STATE: GameState = {
  unit_score: 0,
  bonus_score: 0,
  health: 0,
  solutions: [],
}

const STARTING_LEVEL_STATE: GameLevel = {
  start: 0,
  target: 0,
  steps: [],
}

export default defineStore('game', (): GameStore => {
  // --------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------

  const settings = ref<GameSettings>({
    difficulty: 100,
  })

  const currentLevel = ref<GameLevel>({
    ...STARTING_LEVEL_STATE,
  })

  const stateRaw = ref<GameState>({
    ...STARTING_GAME_STATE,
  })

  const state = computed(() => ({
    ...stateRaw.value,
    score: stateRaw.value.unit_score + stateRaw.value.bonus_score,
    level_number: stateRaw.value.solutions.length + 1,
    level_state: currentLevel.value,
  }))

  // --------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------

  function startNextLevel(nextLevel: GameLevel) {
    const nextState: GameState = {...stateRaw.value}
    const thisState: GameState = {...state.value}
    if (thisState.level_state) {
      nextState.solutions = [...nextState.solutions, thisState.level_state]
    }

    // apply state changes
    currentLevel.value = nextLevel
    stateRaw.value = nextState
  }

  function increaseScore(unit: number = 0, bonus: number = 0) {
    const nextState: GameState = {...stateRaw.value}

    nextState.unit_score += unit
    nextState.bonus_score += bonus

    stateRaw.value = nextState
  }

  return {
    settings: settings,
    state: state,

    startNextLevel,
    increaseScore,
  }
})
