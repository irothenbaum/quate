<script setup lang="ts">
import {useGameStore} from '@/composables/useGameStore.ts'
import {computed} from 'vue'
import {GameAction} from '@/types/game.ts'
import {isTransitioningLevel} from '@/utilities.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const {levels_completed, score, level_state, game_action} = useGameStore()
const tailIsSelected = computed<boolean>(() => level_state.value.selected.length > 0)
</script>

<template>
  <div class="hud-top">
    <div class="level-container">
      <div class="container-inner">Level: {{ levels_completed + 1 }}</div>
    </div>
    <div
      v-if="level_state"
      :class="{
        'start-container': true,
        active: tailIsSelected,
        correct: (tailIsSelected && game_action === GameAction.submission_correct) || isTransitioningLevel(game_action),
        incorrect: tailIsSelected && game_action === GameAction.submission_incorrect,
      }"
    >
      <div class="start-tail"></div>
      <div class="container-inner">
        <div class="start">
          {{ level_state.start }}
        </div>
      </div>
    </div>
    <div class="score-container">
      <div class="container-inner">Score: {{ score }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

$defaultWidth: 1rem;
$selectedWidth: 2.5rem;

.hud-top {
  z-index: 11;
  height: var(--hud-height);
  width: 100%;
  @include styles.flex-row(0);
  padding: var(--space-md);

  @include styles.small-and-below() {
    padding: var(--space-sm);
  }

  .level-container,
  .start-container,
  .score-container {
    @include styles.hud-section();
  }

  .start-container {
    &.active {
      .start-tail:after {
        width: $selectedWidth;
        left: calc(50% - $selectedWidth / 2);
        background-color: var(--color-pathway-selected);
      }

      &.correct {
        .start-tail:after {
          background-color: var(--color-pathway-correct);
        }
      }

      &.incorrect {
        .start-tail:after {
          background-color: var(--color-tertiary);
        }
      }

      .start {
        background-color: var(--color-pathway-correct);
      }
    }
  }

  .start {
    font-size: 3rem;
    height: 100%;
    width: 100%;
    background-color: var(--color-pathway-correct);
    @include styles.flex-row();
    border-radius: var(--border-radius-md);
  }

  .start-tail {
    width: 30%;
    flex: 1;
    height: var(--space-lg);
    background-color: var(--color-world-shade);
    position: absolute;
    bottom: calc(-1 * var(--space-md));
    z-index: 3;

    &:after {
      content: '';
      position: absolute;
      top: -50%;
      width: $defaultWidth;
      left: calc(50% - $defaultWidth / 2);
      background: linear-gradient(to bottom, var(--color-pathway-correct) 30%, transparent 80%) no-repeat;
      background-color: var(--color-pathway-default);
      transition: all 0.2s ease-out;
      height: 200%;
      border-radius: var(--border-radius-xs);
    }

    @include styles.small-and-below() {
      width: 40%;
      height: var(--space-md);
      bottom: calc(-1 * var(--space-sm));
    }
  }
}
</style>
