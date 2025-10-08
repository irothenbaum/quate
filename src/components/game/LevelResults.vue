<script setup lang="ts">
import {useGameStore} from '@/composables/useGameStore.ts'
import {NEXT_ROUND_TIME_BONUS_MS} from '@/constants/environment.ts'
import {TIMER, POINTS, STREAK} from '@/constants/icons.ts'
import {ref, watch} from 'vue'

const {score, streak_count} = useGameStore()
const lastScore = ref(0)
const lastStreak = ref(0)

watch(
  () => score.value,
  (newScore, oldScore) => {
    lastScore.value = oldScore
  },
)

watch(
  () => streak_count.value,
  (newStreak, oldStreak) => {
    lastStreak.value = oldStreak
  },
)

// TODO: Implement Level Results functionality
// Should appear during the transition between levels
// Display score earned, time taken, accuracy, etc.
// animate score/timer/streak changes accordingly
</script>

<template>
  <div class="level-results">
    <div class="time-increment">
      +{{ NEXT_ROUND_TIME_BONUS_MS / 1000 }}s
      <i :class="TIMER" />
    </div>
    <div class="score-increment">
      +{{ score - lastScore }}
      <i :class="POINTS" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles';

.transition-level-results {
  .level-results {
    opacity: 1;
    transform: translate(-50%, -50%);
    line-height: 1.5em;

    .time-increment,
    .score-increment,
    .streak-increment {
      // background: var(--color-shadow);
      // box-shadow: 0 0 60px 60px var(--color-shadow);
      animation: show-results styles.$transitionResultsSpeed ease-in-out forwards;
    }
  }
}

.level-results {
  position: fixed;
  top: calc(50% + var(--hud-height));
  left: 50%;
  width: 100%;
  max-width: var(--screen-medium-min);
  opacity: 0;
  transform: translate(100%, 0);
  @include styles.flex-row();
  gap: 120px; // this 2x the blur amount
  z-index: 1000;
  align-items: center;

  .time-increment,
  .score-increment,
  .streak-increment {
    flex: 5;
  }

  & > * {
    width: 100%;
    flex: 1;
    text-align: center;
    text-shadow: 6px 6px 20px var(--color-shadow);
    font-size: var(--font-size-xl);
    line-height: 1.5em;

    i {
      font-size: var(--font-size-lg);
    }
  }

  .time-increment {
    color: var(--color-power);
  }

  .score-increment {
  }

  .streak-increment {
  }
}

@keyframes show-results {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
</style>
