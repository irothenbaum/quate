<script setup lang="ts">
import {CLOSE, SHOW_ANSWER, HIDE_ANSWER} from '@/constants/icons.ts'
import RenderTermField from '@/components/game/RenderTermField.vue'
import TermButton from '@/components/game/TermButton.vue'
import {GameAction, type GameLevel, type TermStep} from '@/types/game.ts'
import {computed, onMounted, ref, toRefs} from 'vue'
import {applyTermStep, applyTermSteps} from '@/utilities.ts'

function getSolutionForLevel(l: GameLevel): Array<number> {
  function findPath(columnIndex: number, currentValue: number, path: Array<number>): Array<number> | null {
    // Base case: we've processed all columns
    if (columnIndex === l.steps.length) {
      // Check if we reached the target
      if (currentValue === l.target) {
        return path
      }
      return null
    }

    // Try each TermStep in the current column
    const currentColumn = l.steps[columnIndex]
    for (let i = 0; i < currentColumn.length; i++) {
      const termStep = currentColumn[i]
      const nextValue = applyTermStep(currentValue, termStep)
      const result = findPath(columnIndex + 1, nextValue, [...path, i])
      if (result !== null) {
        return result
      }
    }

    // No valid path found from this state
    return null
  }

  const solution = findPath(0, l.start, [])
  return solution || []
}

const props = defineProps<{
  level_state: GameLevel
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const showingSolution = ref<boolean>(false)
const ready = ref<boolean>(false)
const userSelectedPath = ref<Array<number>>([])
const gameAction = ref<GameAction>(GameAction.ready)

const {level_state} = toRefs(props)

function handleClickTerm(term: TermStep, column: number, row: number) {
  if (showingSolution.value) {
    // Cannot click when showing solution
    return
  }

  let nextSelected = [...userSelectedPath.value]
  if (column > nextSelected.length) {
    // Cannot click ahead, do nothing
    return
  }

  if (nextSelected[column] === row) {
    // Deselecting that + any option after
    nextSelected = nextSelected.filter((n, i) => i < column)
  } else {
    nextSelected[column] = row
  }

  userSelectedPath.value = nextSelected

  if (nextSelected.length === level_state.value.steps.length) {
    // User has made selections for all steps, submit answer
    handleSubmitAnswer()
  }
}

function handleSubmitAnswer() {
  if (showingSolution.value) {
    // Cannot submit when showing solution
    return
  }

  // Check if the selected terms lead to the target
  const answerValue = applyTermSteps(
    level_state.value.start,
    userSelectedPath.value.map((termIndex, stepIndex) => level_state.value.steps[stepIndex][termIndex]),
  )

  const isCorrect = answerValue === level_state.value.target

  if (isCorrect) {
    gameAction.value = GameAction.submission_correct
  } else {
    gameAction.value = GameAction.submission_incorrect
  }

  setTimeout(() => {
    gameAction.value = GameAction.ready
    userSelectedPath.value = []
  }, 1000)
}

const final_level_state = computed<GameLevel>(() => {
  if (showingSolution.value) {
    return {
      ...level_state.value,
      selected: getSolutionForLevel(level_state.value),
    }
  } else {
    return {
      ...level_state.value,
      selected: userSelectedPath.value,
    }
  }
})

onMounted(() => {
  setTimeout(() => {
    ready.value = true
  }, 100)
})

const handleClose = () => {
  ready.value = false
  setTimeout(() => {
    emit('close')
  }, 200)
}
</script>

<template>
  <div
    :class="{
      'level-review-container': true,
      ready: ready,
    }"
  >
    <div>
      <div class="review-row">
        <div />
        <div class="review-start">
          <TermButton :is-correct="true" :is-selected="true">
            {{ level_state.start }}
          </TermButton>
        </div>
        <div>
          <i :class="CLOSE" @click="handleClose()" />
        </div>
      </div>
      <div class="review-term-field">
        <RenderTermField
          :level_state="final_level_state"
          :game_action="showingSolution ? GameAction.submission_correct : gameAction"
          :handleClickTerm="showingSolution ? undefined : handleClickTerm"
        />
      </div>
      <div class="review-row">
        <div />
        <div class="review-target">
          <TermButton
            :is-selected="showingSolution || gameAction !== GameAction.ready"
            :is-correct="showingSolution || gameAction === GameAction.submission_correct"
            :is-incorrect="!showingSolution && gameAction === GameAction.submission_incorrect"
          >
            {{ level_state.target }}
          </TermButton>
        </div>
        <div>
          <i :class="showingSolution ? HIDE_ANSWER : SHOW_ANSWER" @click="showingSolution = !showingSolution" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

.level-review-container {
  height: 100%;
  width: 100%;
  padding: var(--space-xl);
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  transition: all 0.2s ease-in-out;

  & > div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    transform: translateY(20px);
    transition: all 0.2s ease-in-out;
  }

  &.ready {
    opacity: 1;
    & > div {
      transform: translateY(0);
    }
  }

  .review-row {
    @include styles.flex-row();
    width: 100%;
    align-items: center;
    gap: var(--space-lg);

    & > div {
      flex: 1;
      @include styles.flex-row();

      &:last-child {
        justify-content: flex-end;
      }
    }

    i {
      font-size: var(--font-size-xxl);
      color: var(--color-white);
      cursor: pointer;
    }
  }

  .review-term-field {
    flex: 1;
  }
}
</style>
