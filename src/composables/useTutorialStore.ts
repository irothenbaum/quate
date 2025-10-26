import {storeToRefs} from 'pinia'
import type {Ref} from 'vue'

import useTS from '@/stores/tutorial'

interface TutorialStore {
  force_close: Ref<boolean>
  score: Ref<number>
  timer_ms: Ref<number>
  streak: Ref<number>
  level: Ref<number>
  target_number: Ref<number>
  start_number: Ref<number>
  start_tail_is_selected: Ref<boolean>
  target_tail_is_selected: Ref<boolean>
  tails_are_correct: Ref<number>
}

export function useTutorialStore(): TutorialStore {
  const tutStore = useTS()
  const refs = storeToRefs(tutStore)

  return {
    ...tutStore, // includes actions and non-reactive methods
    ...refs, // overrides state/getters with their ref versions
  }
}
