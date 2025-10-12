<script setup lang="ts">
import TermButton from '@/components/game/TermButton.vue'
import {PLAY, TUTORIAL} from '@/constants/icons.ts'
import {ref} from 'vue'
import {HIGH_SCORE_CACHE_KEY, TRANSITION_STEP_MS} from '@/constants/environment.ts'
import IncrementingNumber from '@/components/utility/IncrementingNumber.vue'

const emits = defineEmits<{
  (e: 'start-game'): void
  (e: 'start-tutorial'): void
}>()

const selectedButton = ref<number | null>(null)
const BUTTON_PLAY = 0
const BUTTON_TUTORIAL = 1

const highScore = ref<number>(parseInt(localStorage[HIGH_SCORE_CACHE_KEY]) || 0) // Placeholder for high score

function handleClickPlay() {
  selectedButton.value = BUTTON_PLAY
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
</script>

<template>
  <div id="menu-content">
    <h1>Quate</h1>
    <div class="buttons-container">
      <TermButton :is-correct="selectedButton === BUTTON_TUTORIAL" @click="handleClickTutorial()">
        <i :class="TUTORIAL" />
      </TermButton>
      <TermButton :is-correct="selectedButton === BUTTON_PLAY" @click="handleClickPlay()">
        <i :class="PLAY" />
      </TermButton>
    </div>

    <h3>High score:</h3>
    <IncrementingNumber :number="highScore" :animation-duration="1000" />
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

  span {
    font-size: var(--font-size-xxl);
  }

  .buttons-container {
    @include styles.flex-row();

    i {
      font-size: var(--font-size-xl);
      color: var(--color-text);
      transition: color 0.2s ease-in-out;
    }
  }
}
</style>
