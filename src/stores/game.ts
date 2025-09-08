import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import type {GameLevel, TermStep} from '@/types/game.ts'

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
  const health = ref<number>(1)
  const solutions = ref<Array<GameLevel>>([])
  const difficulty = ref<number>(100)

  const score = computed(() => unit_score.value + bonus_score.value)
  const levels_completed = computed(() => solutions.value.length)
  const level_state = ref<GameLevel | undefined>()

  // --------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------

  function restartGame() {
    level_state.value = {...STARTING_LEVEL_STATE}
    unit_score.value = 0
    bonus_score.value = 0
    health.value = 1
    solutions.value = []
  }

  function startNextLevel(nextLevel: GameLevel) {
    if (level_state.value) {
      // TODO: should we store this level's score? If so, can we merge this with increaseScore
      solutions.value = [...solutions.value, level_state.value]
    }

    // apply state changes
    level_state.value = nextLevel
  }

  function increaseScore(unit: number = 0, bonus: number = 0) {
    console.log('HERE', unit)
    unit_score.value += unit
    bonus_score.value += bonus
  }

  function handleClickTerm(term: TermStep, column: number, row: number) {
    if (!level_state.value) {
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
    health,
    level_state,
    levels_completed,
    solutions,

    difficulty,

    startNextLevel,
    increaseScore,
    restartGame,
    handleClickTerm,
  }
})
