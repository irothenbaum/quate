import {storeToRefs} from 'pinia'
// import type {StoreToRefs} from 'pinia'
import type {Ref} from 'vue'
import type {GameLevel, TermStep} from '@/types/game.ts'
import {GameAction} from '@/types/game.ts'

import useGS from '@/stores/game'

// ChatGPT says I could define GameStore generatively like this, but i'm not sure it's working?
// type GameStoreRaw = ReturnType<typeof useGS>
// type GameStore = GameStoreRaw & StoreToRefs<GameStoreRaw>

interface GameState {
  unit_score: Ref<number>
  bonus_score: Ref<number>
  solutions: Ref<Array<GameLevel>>
  score: Ref<number> // computed from unit_score + bonus_score
  levels_completed: Ref<number> // computed from solutions.length + 1
  level_state: Ref<GameLevel> // will be empty at the start/end of the game
  game_action: Ref<GameAction> // current game action, i.e., UI state
  last_game_action: Ref<GameAction | null> // previous game action, useful for transitions
  streak_count: Ref<number>
  longest_streak: Ref<number>
  time_remaining_ms: Ref<number> // time remaining in milliseconds
}

interface GameStore extends GameState {
  startNextLevel: (l: GameLevel) => void
  increaseScore: (u: number, b: number) => void
  handleClickTerm: (term: TermStep, column: number, row: number) => void
  restartGame: () => void
}

export function useGameStore(): GameStore {
  const gameStore = useGS()
  const refs = storeToRefs(gameStore)

  return {
    ...gameStore, // includes actions and non-reactive methods
    ...refs, // overrides state/getters with their ref versions
  }
}
