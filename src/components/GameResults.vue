<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {LEVEL, TIMER, STREAK, POINTS, STAR} from '@/constants/icons.ts'
import {useGameStore} from '@/composables/useGameStore.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'
import {HIGH_SCORE_CACHE_KEY, TRANSITION_STEP_MS} from '@/constants/environment.ts'
import LevelReview from '@/components/LevelReview.vue'

const TIMER_SHOW_DELAY = 1200
const BUTTON_ENABLE_DELAY = 4000

const previousHS = parseInt(localStorage.getItem(HIGH_SCORE_CACHE_KEY) || '-1')
const isHidden = ref<boolean>(true)
const showReviewModal = ref<boolean>(false)
const {level_state, levels_completed, score, longest_streak, restartGame} = useGameStore()
const isNewHighScore = ref<boolean>(false)
const buttonDisabled = ref<boolean>(true)

const finalScore = score.value + longest_streak.value * 10 + levels_completed.value * 10
const finalScoreRevealDuration = TRANSITION_STEP_MS + finalScore

onMounted(() => {
  setTimeout(() => {
    isHidden.value = false

    const nextHS = Math.max(previousHS, finalScore)
    localStorage.setItem(HIGH_SCORE_CACHE_KEY, nextHS.toString())

    setTimeout(() => {
      buttonDisabled.value = false
    }, BUTTON_ENABLE_DELAY)
  }, TIMER_SHOW_DELAY)
})

function handleScoreUpdate(currentScore: number) {
  if (currentScore > previousHS) {
    isNewHighScore.value = true
    // You could add some special effect here for new high score
  }
}

const timeUpStr = `time up `.repeat(500)
</script>

<template>
  <div id="game-results" :class="{hidden: isHidden}">
    <div id="game-results-inner">
      <i id="clock-icon" :class="TIMER" />
      <div class="results-container">
        <h1>Results</h1>
        <ul>
          <li>
            <i :class="LEVEL" />
            <IncrementingNumber :number="isHidden ? 0 : levels_completed" :animation-delay="TIMER_SHOW_DELAY + 500" />
            <span class="multiplier">x10</span>
          </li>
          <li>
            <i :class="STREAK" />
            <IncrementingNumber :number="isHidden ? 0 : longest_streak" :animation-delay="TIMER_SHOW_DELAY + 1000" />
            <span class="multiplier">x10</span>
          </li>
          <li>
            <i :class="POINTS" />
            <IncrementingNumber :number="isHidden ? 0 : score" :animation-delay="TIMER_SHOW_DELAY + 1500" />
          </li>
        </ul>

        <div class="total-highscore">
          <span class="label">Score:</span>
          <span>
            <IncrementingNumber
              :number="isHidden ? 0 : finalScore"
              :animation-delay="TIMER_SHOW_DELAY + 2000"
              :animation-duration="finalScoreRevealDuration"
              @update="handleScoreUpdate"
            />

            <span
              :class="{
                'highscore-icon': true,
                'new-highscore': isNewHighScore,
                [STAR]: true,
              }"
            >
            </span>
          </span>
        </div>
        <div class="buttons-container">
          <div :class="{'review-button': true, disabled: buttonDisabled}" @click="showReviewModal = true">
            <span>Review last round</span>
          </div>
          <div :class="{'menu-button': true, disabled: buttonDisabled}" @click="restartGame()">
            <span>Main menu</span>
          </div>
        </div>
      </div>
    </div>
    <div class="background-decor">
      {{ timeUpStr }}
    </div>
    <div v-if="showReviewModal" class="review-modal-overlay">
      <LevelReview :level_state="level_state" @close="showReviewModal = false" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

#game-results {
  @include styles.hero-center();
  background-color: var(--color-tertiary);

  .background-decor {
    @include styles.overlay();
    overflow: hidden;

    font-size: 3rem;
    color: var(--color-white);
    opacity: 0.05;
    line-height: 1.2em;
    pointer-events: none;
    user-select: none;
    word-break: break-all;
    text-align: justify;
    transition: opacity 0.2s ease-in-out;
  }

  #game-results-inner {
    @include styles.flex-column(0);
    position: relative;
    z-index: 5;
    justify-content: center;
    align-items: center;
  }

  #clock-icon {
    font-size: 0;
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  .results-container {
    transition: all 0.2s ease-in-out;
    transform: translateY(0);
    opacity: 1;
    text-shadow:
      0 0 10px var(--color-tertiary-shade),
      0 0 4px var(--color-tertiary-dark-shade);
    overflow: hidden;

    ul {
      li {
        @include styles.flex-row();
        margin-bottom: var(--space-md);
        justify-content: flex-start;
        font-size: var(--font-size-xl);
        line-height: 1.2em;

        .multiplier {
          margin-left: var(--space-sm);
          font-size: var(--font-size-md);
        }
      }
    }

    .total-highscore {
      border-top: 2px solid var(--color-white);
      margin-top: var(--space-lg);
      padding-top: var(--space-lg);
      @include styles.flex-row();
      font-size: var(--font-size-xxl);
      font-weight: bold;
      line-height: 1.2em;

      .label {
        font-weight: normal;
        font-size: var(--font-size-md);
      }

      .highscore-icon {
        transform: scale(0);
        transition: transform 0.2s ease-in-out;
        margin-left: var(--space-md);

        &.new-highscore {
          font-size: var(--font-size-xxl);
          color: var(--color-gold);
          transform: scale(1);
          animation: pulse 1s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      }
    }
  }

  h1 {
    color: var(--color-text);
    font-size: 4rem;
    line-height: 1em;
    margin-bottom: var(--space-xl);
  }

  &.hidden {
    .background-decor {
      opacity: 0.2;
    }

    .results-container {
      opacity: 0;
      height: 0;
      transform: translateY(var(--space-lg));
      pointer-events: none;
    }

    #clock-icon {
      font-size: 8rem;
      opacity: 1;
      animation: shake 0.5s ease-in-out infinite;
    }
  }

  .buttons-container {
    @include styles.flex-row(0);
    flex-direction: column;
    margin-top: var(--space-xl);
    gap: var(--space-xxl);
  }

  .menu-button,
  .review-button {
    @include styles.sliver-button(var(--color-white), var(--color-white), var(--color-white));
    transition: all 0.2s ease-in-out;
    padding: var(--space-md) var(--space-xl);
    color: var(--color-tertiary);
    text-shadow: none;
    font-size: var(--font-size-xxl);

    &:before {
      box-shadow: 0 0 0 var(--color-glow);
    }

    &:hover {
      transform: translateY(-2px);
      &:before {
        box-shadow: 0 0 20px var(--color-glow);
      }
    }
  }

  .review-button {
    font-size: var(--font-size-lg);
    padding: var(--space-sm) var(--space-lg);
  }

  .review-modal-overlay {
    @include styles.overlay();
    z-index: 10;
  }
}

@keyframes shake {
  0% {
    transform: rotateZ(-10deg) translate(-2px, 2px);
  }
  10% {
    transform: rotateZ(10deg) translate(2px, -2px);
  }
  20% {
    transform: rotateZ(-10deg) translate(2px, 2px);
  }
  30% {
    transform: rotateZ(10deg) translate(-2px, -2px);
  }
  40% {
    transform: rotateZ(-10deg) translate(-2px, 2px);
  }
  50% {
    transform: rotateZ(10deg) translate(2px, -2px);
  }
  60% {
    transform: rotateZ(-10deg) translate(2px, 2px);
  }
  70% {
    transform: rotateZ(10deg) translate(-2px, -2px);
  }
  80% {
    transform: rotateZ(-10deg) translate(-2px, 2px);
  }
  100% {
    transform: rotateZ(10deg) translate(-2px, -2px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    text-shadow: 0 0 5px var(--color-gold-tint);
  }
  50% {
    transform: scale(1.1);
    text-shadow: 0 0 15px var(--color-gold-tint);
  }
  100% {
    transform: scale(1);
    text-shadow: 0 0 5px var(--color-gold-tint);
  }
}
</style>
