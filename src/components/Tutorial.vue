<script setup lang="ts">
import {watch, ref, watchEffect} from 'vue'
import {GameAction, Operation} from '@/types/game.ts'
import type {GameLevel, TermStep} from '@/types/game.ts'
import {generateLevelSteps, applyTermSteps} from '@/utilities.ts'
import {RIGHT_ANSWER_TIMEOUT, TRANSITION_STEP_MS, WRONG_ANSWER_TIMEOUT} from '@/constants/environment.ts'
import RenderTermField from '@/components/game/RenderTermField.vue'
import {ARROW_DOWN, ARROW_UP} from '@/constants/icons'
import {useTutorialStore} from '@/composables/useTutorialStore.ts'

const STEP_INTRO = 0
const STEP_HUD_START = 1
const STEP_HUD_TARGET = 2
const STEP_EQUATION_PATH = 3
const STEP_TERM_1 = 4
const STEP_TERM_SELECT_1 = 5
const STEP_TERM_1_CONFIRM = 6
const STEP_TERM_2 = 7
const STEP_TERM_SELECT_2 = 8
const STEP_TERM_2_CONFIRM = 9

const STEP_HUD_LEVEL = 10
const STEP_HUD_STREAK = 11
const STEP_HUD_SCORE = 12
const STEP_HUD_TIMER = 13

const STEP_BYE_BYE = 14

const emits = defineEmits<{
  (e: 'tutorial-complete'): void
}>()

const {
  start_tail_is_selected,
  score,
  streak,
  target_number,
  start_number,
  level,
  timer_ms,
  target_tail_is_selected,
  tails_are_correct,
  force_close,
} = useTutorialStore()
const step = ref<number>(STEP_INTRO)
const hideNext = ref<boolean>(true)
const tutGameAction = ref<GameAction>(GameAction.ready)
const term1LevelState = ref<GameLevel>(generateLevelSteps(1, Math.ceil(Math.random() * 10), 20, [2]))
const term2LevelState = ref<GameLevel>(generateLevelSteps(1, Math.ceil(Math.random() * 10), 20, [1, 2]))

watch(
  step,
  newStep => {
    if (newStep === STEP_TERM_SELECT_1) {
      start_number.value = term1LevelState.value.start
      target_number.value = term1LevelState.value.target
      timer_ms.value = 60000
    } else if (newStep === STEP_TERM_SELECT_2) {
      start_number.value = term2LevelState.value.start
      target_number.value = term2LevelState.value.target
      timer_ms.value = 60000
    }
    level.value = newStep

    hideNext.value = true
    setTimeout(() => {
      hideNext.value = false
    }, 1000)
  },
  {
    immediate: true,
  },
)

function handleNextClick() {
  if (step.value === STEP_BYE_BYE) {
    emits('tutorial-complete')
    return
  }

  const nextStep = step.value + 1

  if (nextStep === STEP_TERM_1_CONFIRM) {
    // reset term selections for next level
    term2LevelState.value.selected = []
  } else if (nextStep === STEP_TERM_2_CONFIRM) {
    // reset term selections for next level
    term1LevelState.value.selected = []
  }

  if ([STEP_TERM_SELECT_1, STEP_TERM_SELECT_2, STEP_TERM_1_CONFIRM, STEP_TERM_2_CONFIRM].includes(nextStep)) {
    // if we're transitioning into these, we want to do a little close animation
    force_close.value = true
    setTimeout(() => {
      step.value = nextStep
      setTimeout(() => {
        force_close.value = false
      }, TRANSITION_STEP_MS)
    }, TRANSITION_STEP_MS)
  } else {
    step.value = nextStep
  }
}

watchEffect(() => {
  if (![STEP_TERM_SELECT_1, STEP_TERM_SELECT_2].includes(step.value)) {
    tails_are_correct.value = 0
    start_tail_is_selected.value = false
    target_tail_is_selected.value = false
    start_number.value = 0
    target_number.value = 0
    tutGameAction.value = GameAction.ready
    return
  }

  const level_state = step.value === STEP_TERM_SELECT_1 ? term1LevelState : term2LevelState

  // reset game action when step changes
  start_tail_is_selected.value = level_state.value.selected.length > 0
  target_tail_is_selected.value = level_state.value.selected.length === level_state.value.steps.length

  // check if the selected terms lead to the target
  const answerValue = applyTermSteps(
    level_state.value.start,
    level_state.value.selected.map((termIndex, stepIndex) => level_state.value.steps[stepIndex][termIndex]),
  )

  tails_are_correct.value = !target_tail_is_selected.value ? 0 : answerValue === level_state.value.target ? 1 : -1
})

function handleClickTerm(term: TermStep, column: number, row: number) {
  const level_state = step.value === STEP_TERM_SELECT_1 ? term1LevelState : term2LevelState

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

  if (level_state.value.selected.length === level_state.value.steps.length) {
    // check if the selected terms lead to the target
    const answerValue = applyTermSteps(
      level_state.value.start,
      level_state.value.selected.map((termIndex, stepIndex) => level_state.value.steps[stepIndex][termIndex]),
    )

    if (answerValue === level_state.value.target) {
      // correct!
      tutGameAction.value = GameAction.submission_correct
      // mark it completed immediately
      level_state.value.completed_timestamp = Date.now()

      streak.value += 1
      score.value += 10 * level_state.value.selected.length * streak.value

      setTimeout(() => {
        handleNextClick()
      }, RIGHT_ANSWER_TIMEOUT)
    } else {
      // wrong!
      tutGameAction.value = GameAction.submission_incorrect
      streak.value = 0
      setTimeout(() => {
        level_state.value.selected = []
        tutGameAction.value = GameAction.ready
      }, WRONG_ANSWER_TIMEOUT)
    }
  }
}

const titles: Record<number, string> = {
  [STEP_INTRO]: 'This is Quate',
  [STEP_HUD_START]: 'Starting number',
  [STEP_HUD_TARGET]: 'Target number',
  [STEP_EQUATION_PATH]: 'Selecting Terms',
  [STEP_TERM_1]: "Let's try an example",
  [STEP_TERM_1_CONFIRM]: 'Great job!',
  [STEP_TERM_2]: 'Clicking two terms',
  [STEP_TERM_2_CONFIRM]: 'Nice!',
  [STEP_HUD_SCORE]: 'Your score',
  [STEP_HUD_LEVEL]: 'Current level',
  [STEP_HUD_TIMER]: 'Time remaining',
  [STEP_HUD_STREAK]: 'Streak count',
  [STEP_BYE_BYE]: 'Good luck, have fun!',
}

const messages: Record<number, string> = {
  [STEP_INTRO]: 'Your goal is to build an equation that connects the start number to the end number',
  [STEP_HUD_START]: 'This is the number you start at',
  [STEP_HUD_TARGET]: 'This is the number you need to end at',
  [STEP_EQUATION_PATH]:
    'Terms will appear in this middle space. Your job is to select the right sequence to reach the target number.',
  [STEP_TERM_1]: `In a moment, you'll see two terms. Click the one that equals the target number when applied to the start number`,
  [STEP_TERM_1_CONFIRM]: 'You applied the right term to reach the target number',
  [STEP_TERM_2]: "Next you'll need to select two terms: one from each row, starting from the top",
  [STEP_TERM_2_CONFIRM]: 'You selected the correct terms to reach the target number. Just a couple more things...',
  [STEP_HUD_SCORE]: 'Your score increases based on how quickly and accurately you complete equations',
  [STEP_HUD_LEVEL]: 'As you complete equations, your level will increase, making the game more challenging',
  [STEP_HUD_TIMER]: 'You have a limited amount of time to complete each equation. Keep an eye on the timer!',
  [STEP_HUD_STREAK]: 'Answering correctly increases your streak, which boosts your score multiplier',
  [STEP_BYE_BYE]: 'You are ready to start your Quate adventure. May the Maths be with you!',
}

const classes: Record<number, string> = {
  [STEP_INTRO]: 'v-center h-center',
  [STEP_HUD_START]: 'v-top h-center',
  [STEP_HUD_TARGET]: 'v-bottom h-center',
  [STEP_EQUATION_PATH]: 'v-center h-center',
  [STEP_TERM_1]: 'v-top h-center',
  [STEP_TERM_1_CONFIRM]: 'v-center h-center',
  [STEP_TERM_2]: 'v-top h-center',
  [STEP_TERM_2_CONFIRM]: 'v-center h-center',
  [STEP_HUD_SCORE]: 'v-bottom h-right',
  [STEP_HUD_LEVEL]: 'v-top h-left',
  [STEP_HUD_TIMER]: 'v-bottom h-left',
  [STEP_HUD_STREAK]: 'v-top h-right',
  [STEP_BYE_BYE]: 'v-center h-center',

  [STEP_TERM_SELECT_1]: 'hidden',
  [STEP_TERM_SELECT_2]: 'hidden',
}

const arrowClasses: Record<number, string> = {
  [STEP_HUD_START]: 'v-top h-center',
  [STEP_HUD_TARGET]: 'v-bottom h-center',
  [STEP_HUD_SCORE]: 'v-bottom h-right',
  [STEP_HUD_LEVEL]: 'v-top h-left',
  [STEP_HUD_TIMER]: 'v-bottom h-left',
  [STEP_HUD_STREAK]: 'v-top h-right',
}
</script>

<template>
  <div id="tutorial-content">
    <div :class="['arrow', arrowClasses[step]]">
      <i
        :class="{
          [ARROW_UP]: arrowClasses[step] && arrowClasses[step].includes('v-top'),
          [ARROW_DOWN]: arrowClasses[step] && arrowClasses[step].includes('v-bottom'),
        }"
      />
    </div>
    <div :class="['tutorial-text', classes[step]]">
      <h2>{{ titles[step] }}</h2>
      <p>{{ messages[step] }}</p>
      <div class="next-button" :class="{disabled: hideNext}" @click="handleNextClick()">
        <span v-if="step === STEP_BYE_BYE">Main menu</span>
        <span v-else>Next</span>
      </div>
    </div>
    <template v-if="step === STEP_TERM_SELECT_1">
      <RenderTermField :level_state="term1LevelState" :handleClickTerm="handleClickTerm" :game_action="tutGameAction" />
    </template>
    <template v-else-if="step === STEP_TERM_SELECT_2">
      <RenderTermField :level_state="term2LevelState" :handleClickTerm="handleClickTerm" :game_action="tutGameAction" />
    </template>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

$overlayColor: rgba(0, 0, 0, 0.7);

#tutorial-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .tutorial-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    transition: all 0.2s ease;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 1;

    &.v-center {
      top: 50%;
    }

    &.v-top {
      top: 30%;
    }

    &.v-bottom {
      top: 70%;
    }

    &.h-center {
      left: 50%;
    }

    &.h-left {
      left: 50%;
    }

    &.h-right {
      left: 50%;
    }

    @include styles.small-and-below() {
      width: 80%;

      &.h-left,
      &.h-right {
        left: 50%;
      }
    }

    &.hidden {
      opacity: 0;
    }

    h2 {
      margin-bottom: var(--space-md);
      font-size: var(--font-size-lg);
    }
  }

  .next-button {
    margin: var(--space-md) auto;
    width: 80%;

    @include styles.sliver-button(var(--color-primary), var(--color-primary-tint), var(--color-grey));
  }

  .arrow {
    position: absolute;
    transition: all 0.2s ease;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);

    i {
      font-size: 4rem;
      color: var(--color-white);
    }

    &.v-top {
      top: 10%;
    }
    &.v-bottom {
      top: 90%;
    }
    &.h-left {
      left: 20%;
    }
    &.h-right {
      left: 80%;
    }
  }
}
</style>
