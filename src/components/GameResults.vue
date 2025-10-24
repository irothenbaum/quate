<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {LEVEL, TIMER, STREAK, POINTS} from '@/constants/icons.ts'
import {useGameStore} from '@/composables/useGameStore.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'
import {HIGH_SCORE_CACHE_KEY} from '@/constants/environment.ts'

const isHidden = ref<boolean>(true)
const {levels_completed, score, longest_streak, restartGame} = useGameStore()

const buttonDisabled = ref<boolean>(true)

onMounted(() => {
  setTimeout(() => {
    isHidden.value = false

    const nextHS = Math.max(parseInt(localStorage.getItem(HIGH_SCORE_CACHE_KEY) || '0'), score.value)
    localStorage.setItem(HIGH_SCORE_CACHE_KEY, nextHS.toString())

    setTimeout(() => {
      buttonDisabled.value = false
    }, 2000)
  }, 1200)
})

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
            <IncrementingNumber :number="levels_completed" :animation-delay="1000" />
          </li>
          <li>
            <i :class="STREAK" />
            <IncrementingNumber :number="longest_streak" :animation-delay="1000" />
          </li>
          <li>
            <i :class="POINTS" />
            <IncrementingNumber :number="score" :animation-delay="2000" />
          </li>
        </ul>
        <div class="buttons-container">
          <div :class="{button: true, disabled: buttonDisabled}" @click="restartGame()"><span>Main menu</span></div>
        </div>
      </div>
    </div>
    <div class="background-decor">
      {{ timeUpStr }}
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

    ul {
      li {
        @include styles.flex-row();
        margin-bottom: var(--space-md);
        justify-content: flex-start;
        font-size: 2rem;
        line-height: 1.2em;

        i {
        }

        &:last-child {
          i {
            font-size: 1.5rem;
          }

          margin-bottom: 0;
          font-size: 3rem;
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
    margin-top: var(--space-xl);
    gap: var(--space-lg);
  }

  .button {
    @include styles.sliver-button(var(--color-white), var(--color-white), var(--color-white));
    transition: all 0.2s ease-in-out;
    padding: var(--space-md) var(--space-xl);
    color: var(--color-tertiary);
    text-shadow: none;
    font-size: 2rem;

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
</style>
