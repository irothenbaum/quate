import {storeToRefs} from 'pinia'
// import type {StoreToRefs} from 'pinia'
import type {Ref} from 'vue'
import type {GameLevel, TermStep} from '@/types/game.ts'

import useGS from '@/stores/game'

// ChatGPT says I could define GameStore generatively like this, but i'm not sure it's working?
// type GameStoreRaw = ReturnType<typeof useGS>
// type GameStore = GameStoreRaw & StoreToRefs<GameStoreRaw>

interface GameState {
  unit_score: Ref<number>
  bonus_score: Ref<number>
  health: Ref<number>
  solutions: Ref<Array<GameLevel>>
  score: Ref<number> // computed from unit_score + bonus_score
  levels_completed: Ref<number> // computed from solutions.length + 1
  level_state: Ref<GameLevel | undefined> // will be empty at the start/end of the game
}

interface GameSettings {
  difficulty: Ref<number>
}

interface GameStore extends GameSettings, GameState {
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
