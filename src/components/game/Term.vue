<script setup lang="ts">
import type {TermStep} from '@/types/game.ts'
import {getCoordsBetweenNodes, operationToLabel} from '@/utilities.ts'
import {watch, ref, computed} from 'vue'
import {TRANSITION_STEP_MS} from '@/constants/environment.ts'

const props = withDefaults(
  defineProps<{
    term: TermStep
    isSelected?: boolean
    isCorrect?: boolean
    isIncorrect?: boolean
  }>(),
  {
    isSelected: false,
    isCorrect: false,
    isIncorrect: false,
  },
)

const emits = defineEmits<{
  (e: 'click'): void
}>()

const root = ref<HTMLDivElement | null>(null)

// const parent = root.value.parentElement as HTMLDivElement
// const currentLeft = root.value.getBoundingClientRect().left - parent.getBoundingClientRect().left
// const targetLeft = parent.getBoundingClientRect().width / 2

// expose the DOM element to the parent
defineExpose({root})
</script>

<template>
  <!--  <div v-if="isSelected || isCorrect" class="term-shadow"></div>-->
  <div
    @click="() => $emit('click')"
    ref="root"
    :class="{
      term: true,
      selected: isSelected,
      correct: isCorrect,
      incorrect: isIncorrect,
    }"
  >
    <div class="term-inner">
      <span class="operation">{{ operationToLabel[term.operation] }}</span>
      <span class="number">{{ term.number }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

$boxShadowSettings: 0 0 10px 0;

.term-shadow {
  height: var(--term-size);
  width: var(--term-size);
}

.term {
  @include styles.no-text-select();
  cursor: pointer;
  border-radius: 50%;
  height: var(--term-size);
  width: var(--term-size);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0 solid var(--color-world-tint);
  box-shadow: 0 0 0 0 transparent;
  transition: all 0.2s ease-in;

  .term-inner {
    border: 8px solid var(--color-world-tint);
    border-radius: 50%;
    background-color: var(--color-world);
    box-shadow: 0 0 0 0 transparent;
    transition: all 0.2s ease-in;

    height: 90%;
    width: 90%;

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-xl);

    .number {
      margin-left: var(--space-xs);
    }
  }

  &.selected {
    border-width: 4px;
    border-color: var(--color-secondary);

    .term-inner {
      border-color: var(--color-secondary);
    }
  }

  &.correct {
    //position: absolute;
    //left: calc(50% - var(--term-size) / 2);
    //top: 0;
    border-color: var(--color-power);
    box-shadow: $boxShadowSettings var(--color-power);

    .term-inner {
      border-color: var(--color-power);
      box-shadow:
        $boxShadowSettings var(--color-power),
        inset $boxShadowSettings var(--color-power);
    }
  }

  &.incorrect {
    border-color: var(--color-tertiary);

    .term-inner {
      border-color: var(--color-tertiary);
    }
  }
}
</style>
