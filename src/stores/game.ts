import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import type {GameStore, GameSettings, GameState, GameLevel} from '@/types/game.ts'

const STARTING_LEVEL_STATE: GameLevel = {
  start: 0,
  target: 0,
  steps: [[]],
}

export default defineStore('game', (): GameStore => {
  // --------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------

  const unit_score = ref<number>(0)
  const bonus_score = ref<number>(0)
  const health = ref<number>(1)
  const solutions = ref<Array<GameLevel>>([])
  const difficulty = ref<number>(100)

  const score = computed(() => unit_score.value + bonus_score.value)
  const level_number = computed(() => solutions.value.length + 1)
  const level_state = ref<GameLevel>({
    ...STARTING_LEVEL_STATE,
  })

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
    // TODO: this function
  }

  return {
    unit_score,
    bonus_score,
    score,
    health,
    level_state,
    level_number,
    solutions,

    difficulty,

    startNextLevel,
    increaseScore,
    restartGame,
    handleClickTerm,
  }
})
