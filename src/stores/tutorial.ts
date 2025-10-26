import {defineStore} from 'pinia'
import {ref} from 'vue'

export default defineStore('tutorial', () => {
  // --------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------

  const force_close = ref<boolean>(false)
  const score = ref<number>(0)
  const timer_ms = ref<number>(0)
  const streak = ref<number>(0)
  const level = ref<number>(0)
  const target_number = ref<number>(0)
  const start_number = ref<number>(0)
  const start_tail_is_selected = ref<boolean>(false)
  const target_tail_is_selected = ref<boolean>(false)
  const tails_are_correct = ref<number>(0)

  // --------------------------------------------------------------------
  // ACTIONS

  // --------------------------------------------------------------------
  return {
    force_close,
    score,
    timer_ms,
    streak,
    level,
    target_number,
    start_number,
    start_tail_is_selected,
    target_tail_is_selected,
    tails_are_correct,
  }
})
