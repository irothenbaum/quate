<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {PLAY, TUTORIAL, CHALLENGE} from '@/constants/icons.ts'
import {ref} from 'vue'
import {COMPETE_CODE_CACHE_KEY, HIGH_SCORE_CACHE_KEY, TRANSITION_STEP_MS} from '@/constants/environment.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'
import packageInfo from '../../package.json'

const emits = defineEmits<{
  (e: 'start-game'): void
  (e: 'start-tutorial'): void
  (e: 'start-challenge'): void
}>()

const selectedButton = ref<number | null>(null)
const BUTTON_PLAY = 0
const BUTTON_TUTORIAL = 1
const BUTTON_CHALLENGE = 2

const highScore = ref<number>(parseInt(localStorage[HIGH_SCORE_CACHE_KEY]) || 0) // Placeholder for high score

function handleClickPlay() {
  selectedButton.value = BUTTON_PLAY
  // if you click Play from the Menu, we reset any compete code
  localStorage.setItem(COMPETE_CODE_CACHE_KEY, '')
  setTimeout(() => {
    emits('start-game')
  }, TRANSITION_STEP_MS)
}

function handleClickTutorial() {
  selectedButton.value = BUTTON_TUTORIAL
  setTimeout(() => {
    emits('start-tutorial')
  }, TRANSITION_STEP_MS)
}

function handleClickChallenge() {
  selectedButton.value = BUTTON_CHALLENGE
  setTimeout(() => {
    emits('start-challenge')
  }, TRANSITION_STEP_MS)
}
</script>

<template>
  <div id="menu-content">
    <h1>Quate</h1>
    <div class="buttons-container">
      <TermButton
        :is-selected="selectedButton === BUTTON_TUTORIAL"
        :is-correct="selectedButton === BUTTON_TUTORIAL"
        @click="handleClickTutorial()"
      >
        <div class="menu-button">
          <i :class="TUTORIAL" />
          <span>Tutorial</span>
        </div>
      </TermButton>
      <TermButton
        :is-selected="selectedButton === BUTTON_PLAY"
        :is-correct="selectedButton === BUTTON_PLAY"
        @click="handleClickPlay()"
      >
        <div class="menu-button">
          <i :class="PLAY" />
          <span>Play</span>
        </div>
      </TermButton>
      <TermButton
        :is-selected="selectedButton === BUTTON_CHALLENGE"
        :is-correct="selectedButton === BUTTON_CHALLENGE"
        @click="handleClickChallenge()"
      >
        <div class="menu-button">
          <i :class="CHALLENGE" />
          <span>Compete</span>
        </div>
      </TermButton>
    </div>

    <h3>High score:</h3>
    <div class="high-score">
      <IncrementingNumber :number="highScore" :animation-duration="1000" />
    </div>

    <h4 class="version">v {{ packageInfo.version }}</h4>
  </div>
</template>

<style scoped lang="scss">
@use '../styles';

#menu-content {
  height: 100%;
  width: 100%;
  @include styles.flex-column();
  justify-content: center;

  h1 {
    color: var(--color-text);
    font-size: 6rem;
    line-height: 1em;
    margin-bottom: var(--space-lg);
  }

  h3 {
    font-size: var(--font-size-md);
    color: var(--color-text);
    margin-top: var(--space-lg);
    margin-bottom: var(--space-md);
  }

  .high-score {
    font-size: var(--font-size-xxl);
  }

  .buttons-container {
    @include styles.flex-row();

    .menu-button {
      @include styles.menu-button();
    }
  }

  .version {
    position: absolute;
    bottom: var(--space-md);
    right: var(--space-md);
    font-size: var(--font-size-sm);
  }
}
</style>
