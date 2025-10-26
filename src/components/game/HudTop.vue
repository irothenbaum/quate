<script setup lang="ts">
import {useGameStore} from '@/composables/useGameStore.ts'
import {computed} from 'vue'
import {GameAction} from '@/types/game.ts'
import {isTransitioningLevel} from '@/utilities.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'
import {LEVEL, STREAK} from '@/constants/icons.ts'
import {TRANSITION_TOTAL_MS} from '@/constants/environment.ts'
import {useTutorialStore} from '@/composables/useTutorialStore.ts'

// Emits definition
const emit = defineEmits<{
  (e: 'pause'): void
}>()

const {streak, level, start_number, start_tail_is_selected, tails_are_correct} = useTutorialStore()
const {levels_completed, streak_count, level_state, game_action} = useGameStore()

const renderSettings = computed(() => {
  return game_action.value === GameAction.tutorial
    ? {
        streak: streak.value,
        level: level.value,
        start_number: start_number.value,
        start_tail_is_selected: start_tail_is_selected.value,
        tails_are_correct: tails_are_correct.value === 1,
        tails_are_incorrect: tails_are_correct.value === -1,
        levelTransitionSpeed: 0,
      }
    : {
        streak: streak_count.value,
        level: levels_completed.value + 1,
        start_number: level_state.value.start,
        start_tail_is_selected: level_state.value.selected.length > 0,
        tails_are_correct:
          (level_state.value.selected.length > 0 && game_action.value === GameAction.submission_correct) ||
          isTransitioningLevel(game_action.value),
        tails_are_incorrect:
          level_state.value.selected.length > 0 && game_action.value === GameAction.submission_incorrect,
        levelTransitionSpeed: TRANSITION_TOTAL_MS * 2,
      }
})
</script>

<template>
  <div class="hud-top">
    <div class="level-container">
      <div class="container-inner">
        <i :class="LEVEL" />
        <IncrementingNumber :number="renderSettings.level" :animation-duration="renderSettings.levelTransitionSpeed" />
      </div>
    </div>
    <div
      :class="{
        'start-container': true,
        active: renderSettings.start_tail_is_selected,
        correct: renderSettings.tails_are_correct,
        incorrect: renderSettings.tails_are_incorrect,
      }"
    >
      <div class="start-tail"></div>
      <div class="container-inner">
        <IncrementingNumber :number="renderSettings.start_number" class="start" />
      </div>
    </div>
    <div class="streak-container">
      <div class="container-inner">
        <i :class="STREAK" />
        {{ renderSettings.streak }}
      </div>
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
  .streak-container {
    @include styles.hud-section();
  }

  .start-container {
    &.active {
      .start-tail:after,
      .start-tail:before {
        width: $selectedWidth;
        left: calc(50% - $selectedWidth / 2);
      }

      .start-tail:after {
        background-color: var(--color-pathway-selected);
      }

      &.correct {
        .start-tail:after {
          background-color: var(--color-pathway-correct);
        }
      }

      &.incorrect {
        .start-tail:before {
          opacity: 1;
        }

        .start {
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
    transition: all 0.2s ease-out;
  }

  .start-tail {
    width: 30%;
    flex: 1;
    height: var(--space-lg);
    background-color: var(--color-world-shade);
    position: absolute;
    bottom: calc(-1 * var(--space-md));
    z-index: 3;

    &:after,
    &:before {
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

    // this before element mirrors the after element and is used to animate the linear gradient to solid red when incorrect.
    &:before {
      z-index: 2;
      opacity: 0;
      background: var(--color-tertiary);
    }

    @include styles.small-and-below() {
      width: 40%;
      height: var(--space-md);
      bottom: calc(-1 * var(--space-sm));
    }
  }

  .level-container,
  .streak-container {
    .container-inner {
      font-size: 3rem;
      flex-direction: row;
      gap: var(--space-md);
    }
  }
}
</style>
