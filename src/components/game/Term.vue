<script setup lang="ts">
import type {TermStep} from '@/types/game.ts'
import {operationToLabel} from '@/utilities.ts'
import {ref} from 'vue'

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

const root = ref<HTMLDivElement | null>(null)

// expose the DOM element to the parent
defineExpose({root})
</script>

<template>
  <div
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

$size: 7rem;

$boxShadowSettings: 0 0 10px 0;

.term {
  @include styles.no-text-select();
  cursor: pointer;
  border-radius: 50%;
  height: $size;
  width: $size;
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
