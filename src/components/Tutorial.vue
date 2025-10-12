<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {PLAY, TUTORIAL} from '@/constants/icons.ts'
import {computed, ref} from 'vue'
import {HIGH_SCORE_CACHE_KEY, TRANSITION_STEP_MS} from '@/constants/environment.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'

const STEP_INTRO = 0
const STEP_HUD_START = 1
const STEP_HUD_TARGET = 2
const STEP_EQUATION_PATH = 3
const STEP_TERM_1 = 4
const STEP_TERM_SELECT_1 = 5
const STEP_TERM_2 = 6
const STEP_TERM_SELECT_2 = 7

const STEP_HUD_SCORE = 8
const STEP_HUD_LEVEL = 8
const STEP_HUD_TIMER = 9
const STEP_HUD_STREAK = 11

const emits = defineEmits<{
  (e: 'tutorail-complete'): void
}>()

const step = ref<number>(STEP_INTRO)
const focusedBox = ref<{left: number; top: number; width: number; height: number}>({
  top: 0,
  left: 0,
  width: 0,
  height: 0,
})

/*
  The tutorial class currently just stays closed. Instead, I think the class should be like .tutorial-closed.
  Then this component is somehow able to turn Quate's class to "closed" on demand. It then stays always with the
  tutorial class until the user clicks "exit tutorial" or something, and this is just effectively overrides styles
  to match the tutorial step.
 */
</script>

<template>
  <div id="tutorial-content">
    <h1>Tutorial</h1>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

$overlayColor: rgba(0, 0, 0, 0.7);

#tutorial-content {
}
</style>
