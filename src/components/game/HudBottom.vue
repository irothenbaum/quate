<script setup lang="ts">
// Emits definition
import {useGameStore} from '@/composables/useGameStore.ts'
import {computed, watch, ref} from 'vue'
import {formatTime, isTransitioningLevel} from '@/utilities.ts'
import {TIMER, POINTS} from '@/constants/icons.ts'
import {GameAction} from '@/types/game.ts'
import {TRANSITION_TOTAL_MS, TRANSITION_STEP_MS, TRANSITION_RESULTS_MS} from '@/constants/environment.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'
import {useTutorialStore} from '@/composables/useTutorialStore.ts'

const emit = defineEmits<{
  (e: 'timeout'): void
}>()
const {level_state, game_action, time_remaining_ms, score} = useGameStore()
const {timer_ms, target_number, target_tail_is_selected, tails_are_correct, score: tut_score} = useTutorialStore()
const clockTimeMs = ref<number>(0)
const timer = ref<number>(0) // setInerval ID

const renderSettings = computed(() => {
  return game_action.value === GameAction.tutorial
    ? {
        score: tut_score.value,
        target_number: target_number.value,
        target_tail_is_selected: target_tail_is_selected.value,
        tails_are_correct: tails_are_correct.value === 1,
        target_tail_is_incorrect: tails_are_correct.value === -1,
        scoreTransitionDelay: 0,
      }
    : {
        score: score.value,
        target_number: level_state.value.target,
        target_tail_is_selected: level_state.value.selected.length === level_state.value.steps.length,
        tails_are_correct:
          game_action.value === GameAction.submission_correct || isTransitioningLevel(game_action.value),
        target_tail_is_incorrect: game_action.value === GameAction.submission_incorrect,
        scoreTransitionDelay: TRANSITION_STEP_MS + TRANSITION_RESULTS_MS / 2,
      }
})

// this is separated out because it will be updated more frequently
const renderClockTimeMS = computed<number>(() => {
  return (game_action.value === GameAction.tutorial ? timer_ms.value : clockTimeMs.value) || 0
})

const timeParts = computed<string[]>(() => {
  if (renderClockTimeMS.value === null) {
    return ['--', '--']
  }
  return formatTime(renderClockTimeMS.value)
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
        if (
          // we continue ticking through an incorrect submission to show remaining time
          [GameAction.ready, GameAction.submission_incorrect].includes(game_action.value) &&
          clockTimeMs.value !== null
        ) {
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
        low: renderClockTimeMS <= 10000,
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
        active: renderSettings.target_tail_is_selected,
        correct: renderSettings.tails_are_correct,
        incorrect: renderSettings.target_tail_is_incorrect,
      }"
    >
      <div class="target-tail"></div>
      <div class="container-inner">
        <IncrementingNumber :number="renderSettings.target_number" class="target" />
      </div>
    </div>
    <div :class="{'score-container': true, large: renderSettings.score >= 10000}">
      <div class="container-inner">
        <i :class="POINTS" />
        <div>
          <IncrementingNumber :number="renderSettings.score" :animation-delay="renderSettings.scoreTransitionDelay" />
        </div>
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

  .timer-container,
  .score-container {
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

  .score-container {
    .container-inner {
      font-size: 3rem;
    }

    &.large {
      .container-inner {
        font-size: 2rem;
      }
    }
  }
}
</style>
