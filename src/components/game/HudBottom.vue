<script setup lang="ts">
// Emits definition
import {useGameStore} from '@/composables/useGameStore.ts'
import {computed, watch, ref} from 'vue'
import {formatTime, isTransitioningLevel} from '@/utilities.ts'
import {TIMER} from '@/constants/icons.ts'
import {GameAction} from '@/types/game.ts'
import {TRANSITION_TOTAL_MS, TRANSITION_STEP_MS, TRANSITION_RESULTS_MS} from '@/constants/environment.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'

const emit = defineEmits<{
  // (e: 'submit'): void
  (e: 'timeout'): void
}>()
const {level_state, game_action, time_remaining_ms, score} = useGameStore()

const clockTimeMs = ref<number>(0)
const targetIsSelected = computed(() => level_state.value.selected.length === level_state.value.steps.length)
const timer = ref<number>(0) // setInerval ID
const timeParts = computed<string[]>(() => {
  if (clockTimeMs.value === null) {
    return ['--', '--']
  }
  return formatTime(clockTimeMs.value)
})

watch(
  () => game_action.value,
  () => {
    if (game_action.value === GameAction.transition_level_start) {
      setTimeout(() => {
        // reset clock
        clockTimeMs.value = time_remaining_ms.value
      }, TRANSITION_TOTAL_MS / 2)
    } else if (game_action.value === GameAction.ready) {
      if (timer.value) {
        clearInterval(timer.value)
      }
      timer.value = setInterval(() => {
        if (game_action.value === GameAction.ready && clockTimeMs.value !== null) {
          clockTimeMs.value = Math.max(0, (level_state.value.expiration_timestamp || 0) - Date.now())
          if (clockTimeMs.value <= 0) {
            // time's up
            emit('timeout')
            clearInterval(timer.value)
          }
        }
      }, 100) // refresh timer every 100ms
    } else if (game_action.value === GameAction.submission_incorrect) {
      clockTimeMs.value = Math.round(clockTimeMs.value / 2)
      level_state.value.expiration_timestamp = Date.now() + clockTimeMs.value
    }
  },
  {immediate: true},
)
</script>

<template>
  <div class="hud-bottom">
    <div
      :class="{
        'timer-container': true,
        low: clockTimeMs !== null && clockTimeMs <= 10000,
        wrong: game_action === GameAction.submission_incorrect,
      }"
    >
      <div class="container-inner">
        <i :class="TIMER" />
        <div class="timer-inner">
          <span class="time-part" v-for="(p, i) in timeParts" :key="i">{{ p }}</span>
        </div>
      </div>
    </div>
    <div
      :class="{
        'target-container': true,
        active: targetIsSelected,
        correct:
          (targetIsSelected && game_action === GameAction.submission_correct) || isTransitioningLevel(game_action),
        incorrect: targetIsSelected && game_action === GameAction.submission_incorrect,
      }"
    >
      <div class="target-tail"></div>
      <div class="container-inner">
        <IncrementingNumber :number="level_state.target" class="target" />
      </div>
    </div>
    <div class="score-container">
      <div class="container-inner">
        <IncrementingNumber :number="score" :animation-delay="TRANSITION_STEP_MS + TRANSITION_RESULTS_MS / 2" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

$defaultWidth: 1rem;
$selectedWidth: 2.5rem;

.hud-bottom {
  z-index: 10;
  height: var(--hud-height);
  width: 100%;
  @include styles.flex-row(0);
  padding: var(--space-md);

  @include styles.small-and-below() {
    padding: var(--space-sm);
  }

  .timer-container,
  .score-container,
  .target-container {
    @include styles.hud-section();
  }

  .timer-container {
    color: var(--color-text);

    .container-inner {
      gap: var(--space-sm);
      @include styles.small-and-below() {
        gap: var(--space-xs);
      }
    }

    span {
      font-size: var(--font-size-xxl);
      @include styles.small-and-below() {
        font-size: var(--font-size-xl);
      }

      &:after {
        content: ':';
        margin: 0 var(--space-sm);
      }

      &:last-child:after {
        content: '';
        margin: 0;
      }
    }

    &.low,
    &.wrong {
      color: var(--color-tertiary);
    }
  }

  .target-container {
    &.active {
      .target-tail:after {
        width: $selectedWidth;
        left: calc(50% - $selectedWidth / 2);
        background-color: var(--color-pathway-selected);
      }

      &.correct {
        .target-tail:after {
          background-color: var(--color-pathway-correct);
        }
      }

      &.incorrect {
        .target-tail:after {
          background-color: var(--color-pathway-incorrect);
        }

        .target {
          background-color: var(--color-tertiary);
        }
      }

      .target {
        background-color: var(--color-pathway-correct);
      }
    }
  }

  .target {
    font-size: 3rem;
    height: 100%;
    width: 100%;
    background-color: var(--color-pathway-default);
    @include styles.flex-row();
    border-radius: var(--border-radius-md);
    transition: all 0.2s ease-out;
  }

  .target-tail {
    width: 30%;
    flex: 1;
    height: var(--space-lg);
    background-color: var(--color-world-shade);
    position: absolute;
    top: calc(-1 * var(--space-md));
    z-index: 3;

    &:after {
      content: '';
      position: absolute;
      top: -50%;
      width: $defaultWidth;
      left: calc(50% - $defaultWidth / 2);
      background-color: var(--color-pathway-default);
      transition: all 0.2s ease-out;
      height: 200%;
      border-radius: var(--border-radius-xs);
    }

    @include styles.small-and-below() {
      width: 40%;
      height: var(--space-md);
      top: calc(-1 * var(--space-sm));
    }
  }
}
</style>
