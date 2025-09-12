import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import type {GameLevel, TermStep} from '@/types/game.ts'
import {GameAction} from '@/types/game.ts'
import {applyTermStep} from '@/utilities.ts'
import {TRANSITION_STEP_MS} from '@/constants/environment.ts'

const STARTING_LEVEL_STATE: GameLevel = {
  start: 0,
  target: 0,
  steps: [[]],
  selected: [],
}

export default defineStore('game', () => {
  // --------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------

  const unit_score = ref<number>(0)
  const bonus_score = ref<number>(0)
  const solutions = ref<Array<GameLevel>>([])
  const difficulty = ref<number>(100)
  const game_action = ref<number>(GameAction.starting)
  const time_remaining_ms = ref<number>(60000) // 1 minute start time

  const score = computed(() => unit_score.value + bonus_score.value)
  const levels_completed = computed(() => solutions.value.length)
  const level_state = ref<GameLevel>({...STARTING_LEVEL_STATE})

  // --------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------

  function restartGame() {
    level_state.value = {...STARTING_LEVEL_STATE}
    unit_score.value = 0
    bonus_score.value = 0
    solutions.value = []
  }

  function startNextLevel(nextLevel: GameLevel) {
    game_action.value = GameAction.transitioning_level

    let shouldIncreaseClock = false
    // finalize current level if it was started
    // if started_timestamp doesn't exist then we're starting the first level
    if (level_state.value.started_timestamp) {
      // TODO: should we store this level's score? If so, can we merge this with increaseScore
      level_state.value.completed_timestamp = Date.now()
      solutions.value = [...solutions.value, level_state.value]
      time_remaining_ms.value -= level_state.value.completed_timestamp - (level_state.value.started_timestamp || 0)
      shouldIncreaseClock = true
    }

    // don't swap to the new level until the UI has had a chance to hide itself
    setTimeout(() => {
      // apply state changes
      level_state.value = nextLevel
      if (shouldIncreaseClock) {
        time_remaining_ms.value += 10000 // add 10 seconds for each new level
      }
    }, 1.5 * TRANSITION_STEP_MS)

    // Start game timeout
    setTimeout(() => {
      level_state.value.started_timestamp = Date.now()
      level_state.value.expiration_timestamp = Date.now() + time_remaining_ms.value
      game_action.value = GameAction.ready
    }, 4 * TRANSITION_STEP_MS)
  }

  function increaseScore(unit: number = 0, bonus: number = 0) {
    unit_score.value += unit
    bonus_score.value += bonus
  }

  function handleClickTerm(term: TermStep, column: number, row: number) {
    if (game_action.value !== GameAction.ready) {
      // cannot click when not ready
      return
    }

    let nextSelected = [...level_state.value.selected]
    if (column > nextSelected.length) {
      // cannot click ahead, do nothing
      return
    }

    if (nextSelected[column] === row) {
      // deselecting that + any option after
      nextSelected = nextSelected.filter((n, i) => i < column)
    } else {
      nextSelected[column] = row
    }

    level_state.value = {...level_state.value, selected: nextSelected}
  }

  return {
    unit_score,
    bonus_score,
    score,
    level_state,
    levels_completed,
    solutions,
    game_action,
    time_remaining_ms,

    difficulty,

    startNextLevel,
    increaseScore,
    restartGame,
    handleClickTerm,
  }
})
